const Contact = require("../models/contact");
const Company = require("../models/company");
const Joi = require("joi");

function processReq(req) {
  const keys = Object.keys(req);
  for (let key of keys) {
    let curValue = req[key];
    // name, id & email must have value
    if (
      (key === "id" && curValue === null) ||
      (key === "name" && curValue === null) ||
      (key === "email" && curValue === null)
    ) {
      throw new Error("Missing necessary fields");
    }
    // split and restore name & change key 'id' to '_id'
    if (key === "name") {
      req.firstName = curValue.split(" ")[0];
      req.lastName =
        curValue.split(" ").length > 1 ? curValue.split(" ")[1] : undefined;
      delete req.name;
    } else if (key === "id") {
      req._id = curValue;
    } else if (curValue === null) {
      req[key] = undefined;
    }
  }
  return req;
}

async function addContact(req, res) {
  const { id } = req.body;
  const existingContact = await Contact.findById(id).exec();
  if (existingContact) {
    return res.status(409).json("Trying to add duplicate contact");
  }
  try {
    let request = processReq(req.body);
    const schema = Joi.object({
      _id: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      email: Joi.string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
        .required(),
      phoneNumber: Joi.string().pattern(
        new RegExp(
          /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(|-){0,1}[0-9]{2}(|-){0,1}[0-9]{2}(|-){0,1}[0-9]{1}(|-){0,1}[0-9]{3}$/
        )
      ),
      contactOwner: Joi.string(),
      company: Joi.string(),
      lastActivityDate: Joi.string(),
      leadStatus: Joi.string(),
      createDate: Joi.string(),
      jobTitle: Joi.string(),
      lifeCycle: Joi.string(),
    });

    request = await schema.validateAsync(request, {
      allowUnknown: true,
      stripUnknown: true,
    });

    const contact = new Contact(request);
    console.log("addContact -> request", request);
    await contact.save();
    return res.status(201).json(contact);
  } catch (err) {
    return res.status(400).json(err.details[0].message);
  }
}

async function getContact(req, res) {
  let { id } = req.params;
  console.log("id is " + id);
  if (Number(id) === NaN) {
    return res.status(400).json("Provided ID should be a number");
  }
  let contact = await Contact.findById(Number(id)).exec();
  if (!contact) {
    return res.status(404).json("Contact not found");
  }
  contact = JSON.parse(JSON.stringify(contact));
  contact["name"] = contact.firstName + " " + contact.lastName;
  delete contact.firstName;
  delete contact.lastName;
  return res.status(200).json(contact);
}

// api/Contacts?fields=courses;
async function getAllContacts(req, res) {
  //   const { page = 1, pageSize = 10, q = "", fields } = req.query;
  //   const limit = Math.max(pageSize * 1, 10);
  //   const skip = (Math.max(page * 1, 1) - 1) * limit;
  //   const contacts = await Contact.find().limit(limit).skip(skip).exec();
  const contacts = await Contact.find().exec();
  if (!contacts) {
    return res.status(404).json("No contact!");
  }
  let parsedData = contacts.map(
    ({
      _id,
      firstName,
      lastName,
      email,
      phoneNumber,
      contactOwner,
      lastActivityDate,
      createDate,
      leadStatus,
      company,
      jobTitle,
      lifeCycle,
    }) => ({
      id: _id,
      name: `${firstName} ${lastName}`,
      email: email,
      phoneNumber: phoneNumber,
      contactOwner: contactOwner,
      lastActivityDate: lastActivityDate,
      createDate: createDate,
      leadStatus: leadStatus,
      company: company,
      jobTitle: jobTitle,
      lifeCycle: lifeCycle,
    })
  );
  return res.status(200).json(parsedData);
}

async function updateContact(req, res) {
  const { id } = req.params;
  const existingContact = await Contact.findById(id).exec();
  if (!existingContact) {
    return res.status(404).json("Contact not found");
  }
  try {
    let request = processReq(req.body);
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      email: Joi.string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
        .required(),
      phoneNumber: Joi.string().pattern(
        new RegExp(
          /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(|-){0,1}[0-9]{2}(|-){0,1}[0-9]{2}(|-){0,1}[0-9]{1}(|-){0,1}[0-9]{3}$/
        )
      ),
      contactOwner: Joi.string(),
      company: Joi.string(),
      lastActivityDate: Joi.string(),
      leadStatus: Joi.string(),
      createDate: Joi.string(),
      jobTitle: Joi.string(),
      lifeCycle: Joi.string(),
    });

    request = await schema.validateAsync(request, {
      allowUnknown: true,
      stripUnknown: true,
    });
    request = {
      _id: id,
      ...request
    };
    const newContact = await Contact.findByIdAndUpdate(id, request, {
      new: true,
    }).exec();
    return res.status(200).json(newContact);
  } catch (error) {
    return res.status(400).json(error.details[0].message);
  }
}

async function deleteContact(req, res) {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id).exec();
  if (!contact) {
    return res.status(404).json("Contact not found");
  }
  await Company.updateMany(
    { contacts: contact._id },
    {
      $pull: {
        contacts: contact._id,
      },
    }
  ).exec();
  return res.status(200).json(contact);
}

async function addCompany(req, res) {
  const { id, code } = req.params;
  const contact = await Contact.findById(id).exec();
  const company = await Company.findById(code).exec();

  if (!contact) {
    return res.status(404).json("Contact not exist");
  } else if (!company) {
    return res.status(404).json("Company not exist");
  }
  contact.company.addToSet(company._id);
  company.contacts.addToSet(contact._id);

  await contact.save();
  await company.save();
  return res.json(contact);
}

async function removeCompany(req, res) {
  const { id, code } = req.params;
  const contact = await Contact.findById(id).exec();
  const company = await Company.findById(code).exec();

  if (!contact) {
    return res.status(404).json("Contact not exist");
  } else if (!company) {
    return res.status(404).json("Company not exist");
  }

  company.contacts.pull(contact._id);
  contact.company = "";

  await company.save();
  await contact.save();
  return res.status(200).json(contact);
}

module.exports = {
  addContact,
  getContact,
  getAllContacts,
  updateContact,
  deleteContact,
  addCompany,
  removeCompany,
};
