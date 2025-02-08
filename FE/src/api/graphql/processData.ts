export const processGetResidentNeighborhood = (data) => {
  if (data.me.__typename === "InternalError") throw new Error(data.me.message);
  const residentNeighborhoods = data.me.residentNeighborhoods;
  if (residentNeighborhoods.__typename === "InternalError")
    throw new Error(residentNeighborhoods.message);
  // me: User, residentNeighborhoods: ResidentNeighborhoodsType
  return residentNeighborhoods.neighborhoods;
};

export const processGetMyBasicInfo = (data) => {
  if (data.me.__typename !== "User") throw new Error();
  const { nickname, createdAt } = data.me;
  return { nickname, createdAt };
};

export const processSearchJobPosts = (data) => {
  if (data.__typename !== "JobPostConnection") {
    throw new Error(data.message);
  }
  return data;
};

export const processGetMyJobPosts = (data) => {
  if (data.searchJobPosts.__typename !== "JobPostConnection") {
    throw new Error(data.message);
  }
  const posts = data.searchJobPosts.edges.map((edge) => {
    const post = edge.node;
    if (post.applicationCount.__typename === "ApplicationCount") {
      post.applicationCount = post.applicationCount.count;
    } else {
      // InternalError
      post.applicationCount = null; // TODO : applicationCount가 null로 오는 거 처리해야지!!!
    }
    return post;
  });
  return { posts, pageInfo: data.searchJobPosts.pageInfo };
};

export const processGetJobPost = (data) => {
  if (data.getJobPost.__typename !== "JobPost") {
    throw new Error(data.message);
  }
  const post = data.getJobPost;
  if (post.publisher.__typename !== "UserPublicInfo") {
    post.publisher = null;
  }
  if (post.applicationCount.__typename === "ApplicationCount") {
    post.applicationCount = post.applicationCount.count;
  } else {
    post.applicationCount = null;
  }
  if (post.myApplication.__typename === "JobApplications") {
    post.myApplication = post.myApplication.applications;
  } else {
    post.myApplication = null;
  }
  return post;
};

export const processCreatePost = (data) => {
  if (data.createJobPost.__typename !== "JobPost") {
    throw new Error(data.createJobPost.message);
  }
  return data.createJobPost;
};

export const processSetResidentNeighborhood = (data) => {
  console.log("processSetResidentNeighborhood");
  if (data.setResidentNeighborhood.__typename !== "NeighborhoodList") {
    throw new Error(data.setResidentNeighborhood).message;
  }
  return data.setResidentNeighborhood.neighborhoods;
};
