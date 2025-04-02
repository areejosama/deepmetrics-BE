export function pagination(page,size){
     
    if(!page || page<=0){
        page=1;
    }
    if(!size || size<=0){
        size=17;
    }

    const skip= ( page - 1 ) * size;

    return {limit:size,skip}
}