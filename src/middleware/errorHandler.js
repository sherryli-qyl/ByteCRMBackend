module.exports = (error, req, res, next) => {
    console.log(error.name);
    if (error.name === 'validationError'){
        return res.status(400).json({errors: error.errors});
    }
    //error instanceof CustomError

    //winston
    console.error(error);
    return res
    .status(500)
    .json({
        errors:{message: 'something unexpected happened, please contact'}
    });
};


