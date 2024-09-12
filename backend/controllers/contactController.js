const asyncHandler = require('express-async-handler');
const { Contact, validateCreateContact } = require('../models/contact');

// Create Contact
module.exports.createContactCtrl = asyncHandler(async (req, res) => {
    // Validate request body
    const { error } = validateCreateContact(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Create new contact and save it to the database
    // const contact = await Contact.create(req.body);
    // Create new contact and save it to the database
    // const contact = await Contact.create(req.body);
    //create new product and save it to the database 
    // let client = await Contact.findOne({ email: req.body.email });
    // if (client) {
    //     return res.status(400).json({ message: "contact already exist" ,contact: null});
    // }
    const contact = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.country,
        //user: req.user._id,
        message: req.body.message
    });
    // Send response to the client
    res.status(201).json({
        message: "Contact created successfully",
        contact
    });
});

// Get All Contacts
module.exports.getAllContactsCtrl = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort({ created_at: -1 });
    res.status(200).json(contacts);
});

// Get Single Contact
module.exports.getSingleContactCtrl = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
});

// Delete Contact
module.exports.deleteContactCtrl = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "Contact deleted successfully",
        contactId: contact._id
    });
});
