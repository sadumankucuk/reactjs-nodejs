
const models = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

function save(req, res) {
    const contact = {
        name: req.body.name,
        surname: req.body.surname,
        companyName: req.body.companyName,
        userId: req.body.userId
    };
    models.Contact.create(contact).then(result => {
        const phones = req.body.phones.map(item =>
        ({
            phone: item.phone,
            userId: contact.userId,
            contactId: result.id
        }));

        models.Phone.bulkCreate(phones);

        res.status(201).json({
            message: "Contact created successfully",
            contact: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

function update(req, res) {
    const id = req.params.id;

    const contact = {
        name: req.body.name,
        surname: req.body.surname,
        companyName: req.body.companyName,
        userId: req.body.userId
    };

    models.Contact.update(contact,
        {
            where: { id: id, userId: req.body.userId }
        }).then(result => {

            models.Contact.findByPk(id, { include: ["phones"] }).then(result => {
                if (result) {
                    const resultPhones = result.phones.map(item => ({ id: item.id }));
                    const removedPhones = resultPhones.filter(({ id: id1 }) => !req.body.phones
                        .filter(item => item.id).some(({ id: id2 }) => id2 === id1));
                    if(removedPhones.length !== 0) 
                        models.Phone.destroy({ where: { id: removedPhones.map(item => item.id) }});
                        
                    const phones = req.body.phones.map(item =>
                    ({
                        phone: item.phone,
                        userId: contact.userId,
                        contactId: id,
                        id: item.id
                    }));

                    models.Phone.bulkCreate(phones, { updateOnDuplicate: ["id", "phone"] });

                    res.status(200).json({
                        message: "Contact updated successfully",
                        contact: req.body
                    });
                } else {
                    res.status(404).json({
                        message: "Contact not found!"
                    })
                }
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!"
                })
            });


        }).catch(error => {
            res.status(200).json({
                message: "Something went wrong",
                error: error
            });
        })
}

function listById(req, res) {
    const id = req.params.id;

    models.Contact.findByPk(id, { include: ["phones"] }).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: "Contact not found!"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        })
    });
}

function destroy(req, res) {
    const id = req.params.id;

    models.Contact.destroy({ where: { id: id } }).then(result => {
        res.status(200).json({
            message: "Contact deleted successfully"
        });
    }).catch(error => {
        res.status(200).json({
            message: "Something went wrong",
            error: error
        });
    });
}

function search(req, res) {
    models.Contact.findAll(
        {
            where: {
                UserId: req.query.userId,
                [Op.or]: [
                    { name: { [Op.like]: '%' + req.query.name + '%' } },
                    { surname: { [Op.like]: '%' + req.query.surname + '%' } },
                    { companyName: { [Op.like]: '%' + req.query.companyName + '%' } },
                    { '$phones.phone$': { [Op.like]: '%' + req.query.phone + '%' } }
                ]
            },
            include: ["phones"],
        }).then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: "Contact not found!"
                })
            }
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            })
        });
}

function list(req, res) {

    models.User.findByPk(req.query.userId).then(user => {
        if (user === null) {
            res.status(404).json({
                message: "User not found"
            });
        } else {
            models.Contact.findAll(
                {
                    where: { UserId: req.query.userId },
                    include: ["phones"]
                }
            ).then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({
                        message: "Contact not found!"
                    })
                }
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!"
                })
            });
        }

    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    });
}


module.exports = {
    save,
    update,
    listById,
    destroy,
    search,
    list
}