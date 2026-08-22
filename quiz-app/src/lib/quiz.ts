import { doc, DocumentReference, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Group = "highschool" | "adult";
export type Choice = "A" | "B";

export const GROUP_LABEL: Record<Group, string> = {
  highschool: "高校生",
  adult: "大人",
};

export interface VoteCounts {
  highschool: { A: number; B: number };
  adult: { A: number; B: number };
}

export const EMPTY_COUNTS: VoteCounts = {
  highschool: { A: 0, B: 0 },
  adult: { A: 0, B: 0 },
};

function currentDocRef(): DocumentReference {
  return doc(db, "quiz", "current");
}

export async function castVote(group: Group, choice: Choice): Promise<void> {
  await setDoc(
    currentDocRef(),
    { [`${group}.${choice}`]: increment(1) },
    { merge: true }
  );
}

export function subscribeToVoteCounts(
  onChange: (counts: VoteCounts) => void
): () => void {
  return onSnapshot(currentDocRef(), (snap) => {
    const data = snap.data() as Partial<VoteCounts> | undefined;
    onChange({
      highschool: { A: 0, B: 0, ...data?.highschool },
      adult: { A: 0, B: 0, ...data?.adult },
    });
  });
}

export async function resetVoteCounts(): Promise<void> {
  await setDoc(currentDocRef(), EMPTY_COUNTS);
}
