// const baseUrl = "http://localhost:5001";
const baseUrl = "https://api-test.kidanstore.com";

const apis = {
    signin: baseUrl + "/admin/auth/signin",
    createAgents:baseUrl+"/admin/agents/create",
    getAgents:baseUrl+"/admin/agents",
    suspendAgent:baseUrl+"/admin/agents/deactivate/",
    activateAgent:baseUrl+"/admin/agents/activate/",
    deleteAgent:baseUrl+"/admin/agents/delete/",
    updateAgentBalance:baseUrl+"/admin/agents/update-balance"
};

export default apis;