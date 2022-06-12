import { isArray, isPlainObject } from 'lodash';
import { authRole } from '../../../shared/constants/AppEnums';

export const getUserFromAuth0 = (user) => {
  if (user)
    return {
      id: 1,
      uid: user.sub,
      displayName: user.name,
      email: user.email,
      photoURL: user.picture,
      role: authRole.user,
    };
  return user;
};

export const getUserFromFirebase = (user) => {
  if (user)
    return {
      id: 1,
      uid: user.uid,
      displayName: user.displayName ? user.displayName : 'Crema User',
      email: user.email,
      photoURL: user.photoURL
        ? user.photoURL
        : '/assets/images/avatar/A11.jpg',
      role: authRole.user,
    };
  return user;
};
export const getUserFromAWS = (user) => {
  if (user)
    return {
      id: 1,
      uid: user.username,
      displayName: user.attributes.name ? user.attributes.name : 'Crema User',
      email: user.attributes.email,
      photoURL: user.photoURL,
      role: authRole.user,
    };
  return user;
};

export const getUserFromJwtAuth = (user) => {
  console.log('getUserFromJwtAuth ---->', user)
  if (user)
    return {
      id: 1,
      uid: user._id,
      displayName: user.username,
      email: user.email,
      photoURL: user.avatar,
      role: authRole.user,
      group: isPlainObject(user.group_id) ? user.group_id : {},
      menu: isArray(user.role) ? user.role : [],
    };
  return user;
};
