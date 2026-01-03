export enum AllowedSequences {
    QUOTE = "QUOTE",
    CLIENT = "CLIENT",
    ADDON_COVER = "ADDON_COVER",
}

export interface ISequence {
    _id: string;
    name: AllowedSequences;
    currentSequenceValue: number;
    paddingLeft: boolean;
    paddingRight: boolean;
    paddingCharacter: string;
    fullLength: number;
}

export const OPTIONS_ALLOWED_SEQUENCE = [
    { label: AllowedSequences.QUOTE, value: AllowedSequences.QUOTE },
    { label: AllowedSequences.CLIENT, value: AllowedSequences.CLIENT },
    { label: AllowedSequences.ADDON_COVER, value: AllowedSequences.ADDON_COVER },
];
