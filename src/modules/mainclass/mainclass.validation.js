import joi from 'joi';

export const createclass = {
  body: joi.object().required().keys({
    name: joi.string()
      .required()
      .min(3)
      .max(70)
      .pattern(/^[A-Z]/)  
      .message('Class must start with an uppercase letter')
  })
};

export const createsubclass = {
    body: joi.object().required().keys({
      subclass: joi.string()
        .required()
        .min(3)
        .max(70)
        .pattern(/^[A-Z]/)  
        .message('Sub Class must start with an uppercase letter'),
      classid:  joi.string()
      .required()
      .min(24)
      .max(24)
    })

  };

  export const createsub2class = {
    body: joi.object().required().keys({
      subsubclass: joi.string()
        .required()
        .min(3)
        .max(70)
        .pattern(/^[A-Z]/)  
        .message('Sub Sub Class must start with an uppercase letter'),
      subclassid: joi.string()
      .required()
      .min(24)
      .max(24),
      sectorid:joi.string()
      .required()
      .min(24)
      .max(24)
    })
  };

  export const createaccount = {
    body: joi.object().required().keys({
      account: joi.string()
        .required()
        .min(3)
        .max(70)
        .pattern(/^[A-Z]/)  
        .message('account must start with an uppercase letter'),
      subsubclassid:  joi.string()
      .required()
      .min(24)
      .max(24),
      sectorid: joi.string()
      .required()
      .min(24)
      .max(24),
    })
  };

  export const createsubaccount = {
    body: joi.object().required().keys({
      subaccount: joi.string()
        .required()
        .min(3)
        .max(70)
        .pattern(/^[A-Z]/)  
        .message('sub account must start with an uppercase letter'),
      accountid:  joi.string()
      .required()
      .min(24)
      .max(24),
      sectorid: joi.string()
      .required()
      .min(24)
      .max(24),
    })
  };