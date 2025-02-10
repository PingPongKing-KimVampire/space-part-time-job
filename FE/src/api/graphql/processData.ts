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
  if (data.searchJobPosts.__typename !== "JobPostConnection") {
    throw new Error(data.message);
  }
  return data.searchJobPosts;
};

export const processGetMyJobPosts = (data) => {
  if (data.searchJobPosts.__typename !== "JobPostConnection") {
    throw new Error(data.message);
  }
  const posts = data.searchJobPosts.edges.map((edge) => {
    const post = JSON.parse(JSON.stringify(edge.node));
    if (post.applicationCount.__typename === "ApplicationCount") {
      post.applicationCount = post.applicationCount.count;
    } else {
      post.applicationCount = null;
    }
    return post;
  });
  return { posts, pageInfo: data.searchJobPosts.pageInfo };
};

export const processGetJobPost = (data) => {
  if (data.getJobPost.__typename !== "JobPost") {
    throw new Error(data.message);
  }
  const post = JSON.parse(JSON.stringify(data.getJobPost));
  if (post.publisher.__typename !== "UserPublicInfo") {
    post.publisher = null;
  }
  if (post.applicationCount.__typename === "ApplicationCount") {
    post.applicationCount = post.applicationCount.count;
  } else {
    post.applicationCount = null;
  }
  if (post.myJobApplication.__typename === "JobApplications") {
    post.myJobApplication = post.myJobApplication.applications;
  } else {
    post.myJobApplication = null;
  }
  return post;
};

export const processGetApplications = (data) => {
  if (data.getJobPost.__typename !== "JobPost") {
    throw new Error(data.message);
  }
  if (data.getJobPost.applications.__typename !== "JobApplications") {
    throw new Error(data.getJobPost.applications.message);
  }
  const applications = data.getJobPost.applications.applications;
  applications.forEach((application) => {
    if (application.applicant.__typename !== "UserPublicInfo")
      application.applicant = null;
  });
  return applications;
};

export const processListMyApplications = (data) => {
  if (data.listMyJobApplications.__typename !== "JobApplications") {
    throw new Error(data.listMyJobApplications.message);
  }
  const applications = JSON.parse(
    JSON.stringify(data.listMyJobApplications.applications)
  );
  applications.map((application) => {
    if (application.jobPost.__typename !== "JobPost") {
      application.jobPost = null;
    }
  });
  return applications;
};

export const processListInterestedPosts = (data) => {
  if (data.listMyInterestedJobPosts.__typename !== "InterestedJobPosts") {
    throw new Error(data.listMyInterestedJobPosts.message);
  }
  return JSON.parse(
    JSON.stringify(data.listMyInterestedJobPosts.interestedJobPosts)
  );
};

export const processCreatePost = (data) => {
  if (data.createJobPost.__typename !== "JobPost") {
    throw new Error(data.createJobPost.message);
  }
  return data.createJobPost;
};

export const processSetResidentNeighborhood = (data) => {
  if (data.setResidentNeighborhood.__typename !== "NeighborhoodList") {
    throw new Error(data.setResidentNeighborhood).message;
  }
  return data.setResidentNeighborhood.neighborhoods;
};

export const processIncrementViews = (data) => {
  if (data.incrementJobPostViews.__typename !== "ViewsCountType") {
    throw new Error(data.incrementJobPostViews.message);
  }
  return data.incrementJobPostViews.count;
};

export const processApplyToPost = (data) => {
  if (data.applyToJobPost.__typename !== "JobApplication") {
    throw new Error(data.applyToJobPost.message);
  }
  return data.applyToJobPost;
};

export const processCancelApplication = (data) => {
  if (data.cancelJobApplication.__typename !== "JobApplication") {
    throw new Error(data.cancelJobApplication.message);
  }
  return data.cancelJobApplication;
};

export const processDecideApplication = (data) => {
  if (data.decideJobApplication.__typename !== "JobApplication") {
    throw new Error(data.decideJobApplication.message);
  }
  return data.decideJobApplication;
};

export const processClosePost = (data) => {
  if (data.closeJobPost.__typename !== "JobPost") {
    throw new Error(data.closeJobPost.message);
  }
  return data.closeJobPost;
};

export const processMarkPostAsInterest = (data) => {
  if (data.markJobPostAsInterest.__typename !== "JobPost") {
    throw new Error(data.markJobPostAsInterest.message);
  }
  return data.markJobPostAsInterest;
};

export const processUnmarkPostAsInterest = (data) => {
  if (data.unmarkJobPostAsInterest.__typename !== "JobPost") {
    throw new Error(data.unmarkJobPostAsInterest.message);
  }
  return data.unmarkJobPostAsInterest;
};
