export const processGetResidentNeighborhood = (data) => {
    if (data.me.__typename === "InternalError")
        throw new Error(data.me.message);
    const residentNeighborhoods = data.me.residentNeighborhoods;
    if (residentNeighborhoods.__typename === "InternalError")
        throw new Error(residentNeighborhoods.message);
    // me: User, residentNeighborhoods: ResidentNeighborhoodsType
    return residentNeighborhoods.neighborhoods;
}

export const processGetMyBasicInfo = (data) => {
    if (data.me.__typename !== "User") throw new Error();
    const { nickname, createdAt } = data.me;
    return { nickname, createdAt };
}

export const processSearchJobPosts = (data) => {
    if (data.__typename !== "JobPostConnection") {
        throw new Error(data.message);
    }
    return data;
}

export const processGetMyJobPosts = (data) => {
    if (data.searchJobPosts.__typename !== "JobPostConnection") {
        throw new Error(data.message);
    }
    const posts = data.searchJobPosts.edges.map((edge) => {
        const post = edge.node;
        if (post.applicationCount.__typename === "ApplicationCount") {
            post.applicationCount = post.applicationCount.count;
        } else { // InternalError
            post.applicationCount = null;
        }
        return post;
    });
    return { posts, pageInfo: data.searchJobPosts.pageInfo };
}