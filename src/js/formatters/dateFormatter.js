import moment from "moment";

export const formatDate=(timestamp, format)=>{
    return moment(timestamp).format(format);  
}