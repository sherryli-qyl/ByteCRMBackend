const Call = require('../models/call');

async function addCall(req, res) {
  const { content, author, contact, outcome } = req.body;
  const call = new Call({
    content,
    author,
    contact,
    outcome,
  });
  await call.save();
  return res.json(call);
}

async function getCall(req, res) {
  const { id } = req.params;
  const call = await Call.findById(id).exec();
  if (!call) {
    return res.status(404).json('call not found');
  }
  return res.json(call);
}

async function getAllCalls(req, res) {
  const calls = await Call.find().exec();
  return res.json(calls);
}

async function updateCall(req, res) {
  const { id } = req.params;
  const { content, author, contact, outcome } = req.body;
  const newCall = await Call.findByIdAndUpdate(
    id,
    { content, author, contact, outcome },
    {
      new: true,
    }
  ).exec();
  if (!newCall) {
    return res.status(404).json('Calls not found');
  }
  return res.json(newCall);
}

async function deleteCall(req, res) {
  const { id } = req.params;

  const call = await Call.findByIdAndDelete(id);
  if (!call) {
    return res.status(404).json('call not found');
  }
  return res.sendStatus(204);
}

module.exports = {
  addCall,
  getCall,
  getAllCalls,
  updateCall,
  deleteCall,
};
