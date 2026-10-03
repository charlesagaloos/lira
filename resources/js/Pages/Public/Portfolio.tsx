import templates from './templates';

import type { PortfolioProps } from './types';

export default function Portfolio({ profile }: PortfolioProps) {
    const templateKey =
        profile.portfolio_settings?.template ?? 'default';

    const template =
        templates[templateKey] ??
        templates.default;

    const TemplateComponent = template.component;

    return <TemplateComponent profile={profile} />;
}
