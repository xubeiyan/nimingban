export const load = async ({ locals }) => {
    const { dbconn } = locals;
    const result = await dbconn.query(`SELECT id, section_name FROM "section"`);
    if (result.rows) {
        return {
            forms: result.rows
        }
    }
}