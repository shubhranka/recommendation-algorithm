import seedDatabase from "../seed/seeder.js"

export default {
    seedDatabase : async (req,res) => {
        const users = await seedDatabase();
        const mappedUsers = users.map(user => {
            return {
                username: user.username,
                password: user.password
            }
        }); 
        return res.json(mappedUsers);
    }
}