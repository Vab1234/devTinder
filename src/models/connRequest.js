const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        // to connect this schema to User collection we use ref
        ref : "User",
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        // status can just be 4 - accept , reject , ignored , interested and we will use enum for it
        enum : {
            values : ["ignored" , "accepted" , "interested" , "rejected"],
            // message : `${VALUE} is incorrect status type`
        },
        required : true
    }
}, 
{
    timestamps : true
});

// schema pre's : middlewares for validation
// this method will always be called before saving the schema
connectionRequestSchema.pre("save" , function(next){
    const connectionRequest = this;

    // check if fromUserId and toUserId are same to restrict req sending to self
    if(connectionRequest.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot send connection request to self");
    }
    next();
});

// indexing our fromUserId and toUserId to make search ops fast
// we are indexing both and this  is known as compound index
// 1 for asc order and -1 for dec order
connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

const ConnectionRequestModel = new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;