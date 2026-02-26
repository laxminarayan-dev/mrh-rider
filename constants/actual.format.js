{
    command_for_get_rider_data: db.orders.aggregate([
        {
            $match: { "riderInfo._id": "699c14039bdfc2203923f676" }
        },
        {
            $lookup: {
                from: "shops",
                localField: "shopId",
                foreignField: "_id",
                as: "shop",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            shopLocation: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$shop"
        },
        // 👇 Add this lookup to get user details
        {
            $lookup: {
                from: "users",           // your users collection name
                localField: "userId",    // field in orders that references the user
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            phone: 1,   // optional, remove if not needed
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true  // keeps order even if user not found
            }
        },
        {
            $project: {
                _id: 1,
                status: 1,
                totalAmount: 1,
                paymentMethod: 1,
                "deliveryAddress.formattedAddress": 1,
                "deliveryAddress.coordinates": 1,
                createdAt: 1,
                orderItems: 1,
                shop: 1,
                // 👇 include user info in output
                "user._id": 1,
                "user.fullName": 1,
                "user.phone": 1,
            }
        }
    ])
}