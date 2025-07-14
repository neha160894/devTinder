const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // reference to the user collection
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: { // enum is used when you want to restrict users for some values
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            }
        }
    }, 
    {
        timestamps: true
    }
);

// use compound index to fasten the queries (eg the below query)
// connectionRequest.find({fromUserId: "some id", toUserId: "some id"})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// the below can be used for validation at schema level (can be done at api level too)
// pre will be called before every save function
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
    next(); // since its a middleware, we need to call next
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;