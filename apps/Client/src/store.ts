// store.ts
import {create} from 'zustand';

interface UserStore {
  username: string;
  roomID: string;
  LocalAudioTrack: MediaStreamTrack | null;
  LocalVideoTrack: MediaStreamTrack | null;
  setUsername: (username: string) => void;
  setRoomID: (roomID:string)=> void;
  setLocalAudioTRACK: (LocalAudioTrack: MediaStreamTrack | null) => void;
  setLocalVideoTRACK: (LocalVideoTrack: MediaStreamTrack | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: '',
  roomID: '',
  LocalAudioTrack: null,
  LocalVideoTrack: null,
  setUsername: (username: string) => set({ username }),
  setRoomID: (roomID : string) => set({roomID}),
  setLocalAudioTRACK: (LocalAudioTrack: MediaStreamTrack | null) => set({ LocalAudioTrack }),
  setLocalVideoTRACK: (LocalVideoTrack: MediaStreamTrack | null) => set({ LocalVideoTrack }),

}));
