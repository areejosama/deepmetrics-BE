import joi from 'joi';

export const createsector={
    body:joi.object().required().keys({
        Sector:joi.string().required().min(3).max(25)
     }) 
}

export const deletesector={
    params:joi.object().required().keys({
        sectorid:joi.string().required().min(24).max(24)
     })  
}

export const updatesector={
     body:joi.object().required().keys({
        Sector:joi.string().required().min(3).max(25)
     })   
}
