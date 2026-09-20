import type { ComponentProps } from 'react';

import templates from './templates';

type PortfolioProps = ComponentProps<typeof templates.default.component>;

export default function Portfolio({ profile }: PortfolioProps) {
    const templateKey = profile.portfolio_settings?.template ?? 'default';

    const template =
        templates[templateKey as keyof typeof templates] ??
        templates.default;

    const TemplateComponent = template.component;

    return <TemplateComponent profile={profile} />;
}
