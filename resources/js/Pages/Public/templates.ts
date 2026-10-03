import DefaultTemplate from './Templates/Default';
import EditorialTemplate from './Templates/Editorial';
import CanvasTemplate from './Templates/Canvas';
import MotionTemplate from './Templates/Motion';
import MusicianTemplate from './Templates/Musician';

import type {
    PortfolioProps,
} from './types';

export type TemplateType = 'free' | 'premium';

export interface PortfolioTemplate {
    id: string;
    name: string;
    description: string;
    type: TemplateType;
    component: React.ComponentType<PortfolioProps>;
}

const templates: Record<string, PortfolioTemplate> = {
    default: {
        id: 'default',
        name: 'Default',
        description:
            'A cinematic and versatile portfolio for any artist.',
        type: 'free',
        component: DefaultTemplate,
    },

    editorial: {
        id: 'editorial',
        name: 'Editorial',
        description:
            'A refined, magazine-inspired layout for visual artists, photographers, and creatives.',
        type: 'free',
        component: EditorialTemplate,
    },

    canvas: {
        id: 'canvas',
        name: 'Canvas',
        description:
            'An expressive freeform portfolio built around composition, imagery, and creative elements.',
        type: 'free',
        component: CanvasTemplate,
    },

    motion: {
        id: 'motion',
        name: 'Motion',
        description:
            'A dynamic portfolio experience built around movement, transitions, and interaction.',
        type: 'free',
        component: MotionTemplate,
    },

    musician: {
        id: 'musician',
        name: 'Musician',
        description:
            'An artist-first website for releases, music, artwork, and your creative identity.',
        type: 'free',
        component: MusicianTemplate,
    },
};

export default templates;
