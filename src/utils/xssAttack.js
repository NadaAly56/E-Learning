


function escapeHtml(body) {
  
    const {password , ...other} = body
    let escape = {};
    for (const key in {...other}) {
        escape[key] = body[key].replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/\$/g, "&#3;")
                                .replace(/{/g, "&#;")
                                .replace(/}/g, "&#;");
        
    }
    if(password){
      escape.password = password
    }
    return escape 
  }


  module.exports = escapeHtml