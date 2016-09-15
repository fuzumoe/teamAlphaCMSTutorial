/**************************************************************************** */
module.exports = {
    //database url
    "database": "mongodb://alpha:alpha@ds161485.mlab.com:61485/teamalpha",
    //application deployment port
    "port": process.env.PORT || 3000,
    //passoerd encryption key
    "EncrptionKey": "teamalphaCMSAdam1987",
    "cloudinary": {
        cloud_name: 'teamalphacms',
        api_key: '746136578657514',
        api_secret: 'kAeoYBG1Oiy4Lc1TcMK-Uw_ofbs',
        CLOUDINARY_URL: 'cloudinary://746136578657514:kAeoYBG1Oiy4Lc1TcMK-Uw_ofbs@teamalphacms',
        Base_delivery_URL: 'http://res.cloudinary.com/teamalphacms',
        Secure_delivery_URL: '	https://res.cloudinary.com/teamalphacms',
        API_Base_URL: '	https://api.cloudinary.com/v1_1/teamalphacms'
    }

};
/**************************************************************************** */