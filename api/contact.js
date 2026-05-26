export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false
        });

    }

    try {

        const { name, email, phone, message } = req.body;

        console.log("New Lead");

        console.log({
            name,
            email,
            phone,
            message
        });

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            success: false
        });

    }

}