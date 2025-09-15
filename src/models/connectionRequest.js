const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"// refernce to the user collection
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{value} is incorrect status type`
        }
    }
},
{timestamps: true}
)

connectionRequestSchema.index({ fromUserId:1 , toUserId:1 })//compound index

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId) ){
        throw new Error("You can not send connection request to yourself")
    }

    next()
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {ConnectionRequest}