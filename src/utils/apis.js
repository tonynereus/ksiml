// const baseUrl = "http://localhost:5001";
const baseUrl = "https://ksiml.tonyicon.com.ng";

const apis = {
    signin: baseUrl + "/admin/auth/signin",
    overview: baseUrl + "/admin/overview",
    createAgents:baseUrl+"/admin/agents/create",
    getAgents:baseUrl+"/admin/agents",
    getTransactions:baseUrl+"/admin/agent-transactions",
    getTickets:baseUrl+"/admin/tickets",
    suspendAgent:baseUrl+"/admin/agents/deactivate/",
    agentSummary:baseUrl+"/admin/agent-transactions",
    deleteAgent:baseUrl+"/admin/agents/delete/",
    updateAgentBalance:baseUrl+"/admin/agents/update-balance",
    updateTicketPrice:baseUrl+"/admin/tickets/update-price"
};

export default apis;