import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    user: null,
    role: null,
  },
});

export const classroomsState = atom({
  key: 'classroomsState',
  default: [],
});

export const studentsState = atom({
  key: 'studentsState',
  default: [],
});

export const teachersState = atom({
  key: 'teachersState',
  default: [],
});
