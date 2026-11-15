import { Project, validWebsiteUrl } from '../model/Project.js';
import { HttpError } from '../utils/errors.js';

function fields(body = {}, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || Object.keys(body).some((key) => !['title', 'description', 'websiteUrl'].includes(key))) {
    throw new HttpError(400, 'Only title, description, websiteUrl, and uploaded images are accepted.');
  }
  const result = {};
  for (const [name, limit] of [['title', 200], ['description', 100000]]) {
    if (partial && !Object.hasOwn(body, name)) continue;
    if (typeof body[name] !== 'string' || !body[name].trim() || body[name].trim().length > limit) {
      throw new HttpError(400, `${name} is required and must be at most ${limit} characters.`);
    }
    result[name] = body[name].trim();
  }
  if (Object.hasOwn(body, 'websiteUrl')) {
    if (typeof body.websiteUrl !== 'string' || !validWebsiteUrl(body.websiteUrl.trim())) {
      throw new HttpError(400, 'Enter a valid HTTP or HTTPS website URL of up to 2,048 characters.');
    }
    result.websiteUrl = body.websiteUrl.trim();
  }
  return result;
}

export function projectController(imageStore) {
  // Cleanup never replaces the original request error or reports a failed DB write after it succeeded.
  async function cleanup(images) {
    const results = await Promise.allSettled(images.map((image) => imageStore.remove(image.publicId)));
    results.forEach((result, index) => {
      if (result.status === 'rejected') console.error('Project image cleanup failed:', images[index].publicId);
    });
  }

  async function find(id) {
    const project = await Project.findById(id);
    if (!project) throw new HttpError(404, 'Project not found.');
    return project;
  }

  async function uploadAndSave(files, save) {
    const uploaded = [];
    try {
      for (const file of files) uploaded.push(await imageStore.upload(file));
      return await save(uploaded);
    } catch (error) {
      await cleanup(uploaded);
      if (error.name === 'VersionError' || error.name === 'DocumentNotFoundError') {
        throw new HttpError(409, 'Project changed. Reload it and try again.');
      }
      throw error;
    }
  }

  return {
    async list(_req, res) {
      res.json({ projects: await Project.find().sort({ createdAt: -1, _id: -1 }) });
    },
    async get(req, res) {
      res.json({ project: await find(req.params.id) });
    },
    async create(req, res) {
      const data = fields(req.body);
      if (!req.files?.length) throw new HttpError(400, 'At least one image is required.');
      const project = await uploadAndSave(req.files, (images) => Project.create({ ...data, userId: req.user._id, images }));
      res.status(201).json({ project });
    },
    async update(req, res) {
      const data = fields(req.body, true);
      if (!Object.keys(data).length && !req.files?.length) throw new HttpError(400, 'Provide fields or images to update.');
      const project = await find(req.params.id);
      const previousImages = project.images.map((image) => image.toObject());
      await uploadAndSave(req.files || [], async (images) => {
        Object.assign(project, data);
        if (images.length) project.images = images;
        return project.save();
      });
      if (req.files?.length) await cleanup(previousImages);
      res.json({ project });
    },
    async remove(req, res) {
      const project = await Project.findOneAndDelete({ _id: req.params.id });
      if (!project) throw new HttpError(404, 'Project not found.');
      await cleanup(project.images);
      res.status(204).end();
    },
  };
}
