//todo: validation before insert
const services_user = require('./db_services/service_user');

const must_be_unique_keys = ["login", "mail"];
var is_all_unique={};
var is_all_unique_boolean=true;

/***return a json if error 400
keys are request who must be respect the unique condition of table in db
if on of those =false, a error will be return, and the db will be not modified

empty json = bad/malformed json request
***/

insert_user = function(req, res){
    is_all_unique={};
    is_all_unique_boolean=true;
    
    //console.log("insert");
    //console.log(req.body);
    
    const login = req.body.login;
    const pwd = req.body.pwd;
    const mail = req.body.mail;
    
    if(login === undefined || pwd === undefined || mail === undefined){
        //console.log("login etc undefined");
        res.status(400);
        res.send({});
        return;
    }
    
    if(true){
        //validation
    }
    
    //make multiple select... in same time to know if a element respect the unique constraint
    for(var i=0; must_be_unique_keys.length > i; i++){
        var mbu = must_be_unique_keys[i]; //mbu = must_be_unique
        services_user.is_element_exists(mbu, req.body[mbu], function(ukey, is_exists, iee_err){
            is_all_unique[ukey] = is_exists;
            
            if(is_exists){
                is_all_unique_boolean = false;
            }
            
            if(is_all_unique_tested()){
                if(iee_err !== null){
                    res.status(400);
                    res.send("db error");
                    return;
                }
                
                if(is_all_unique_boolean){
                    //called if all unique constraint are tested and aprouved (if is_all_unique_boolean = true)
                    services_user.insert({nname:login, mail: mail, pwd: pwd}, function(is_ok, insert_error){
                        if(is_ok){
                            res.status(200);
                            res.send(is_all_unique);
                            return;
                            
                        }else{
                            res.status(400);
                            res.send("undefined error");
                            return;
                        }
                    });
                    
                }else{
                    res.status(400);
                    res.send(is_all_unique);
                    return;
                }
            }
        });
    }
};

is_element_exists = function(req, res){
    const possible_keys = ["app_user_id", "connection_id", "mail", "fb_token", "login"];
    console.log("is_element_exists");
    var on_possible_keys = false;
    for(var index in possible_keys){
        var pkey = possible_keys[index];
        if(req.query[pkey] !== undefined){
            console.log(pkey);
            on_possible_keys = true;
            
            services_user.is_element_exists(pkey, req.query[pkey], function(row_name, is_exists, err){
                if(err){
                    res.status(400);
                    res.send("improbable error");
                    return;
                }
                
                res.status(200);
                if(is_exists){
                    res.send({exists: true});
                }else{
                    res.send({exists: false});
                }
            });
            
            return; //if found a key, stop the for loop
        }
    };
    
    if(!on_possible_keys){
        res.status(400);
        res.send("wrong key");
    };
    
    res.status(200);
    res.send();
};

//utilities functions
function is_all_unique_tested(){
    for(var i=0; must_be_unique_keys.length > i; i++){
        if(!(must_be_unique_keys[i] in is_all_unique)){
            return false;
        }
    }
    return true;
}

module.exports = {
    insert_user,
    is_element_exists
};