export const processGetResidentNeighborhood = (data) => {
    if (data.me.__typename === "InternalError")
        throw new Error(data.me.message);
    const residentNeighborhoods = data.me.residentNeighborhoods;
    if (residentNeighborhoods.__typename === "InternalError")
        throw new Error(residentNeighborhoods.message);
    // me: User, residentNeighborhoods: ResidentNeighborhoodsType
    return residentNeighborhoods.neighborhoods;
}