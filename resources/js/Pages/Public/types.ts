export interface PortfolioSettings {
    cover_image: string | null;
    canvas_background_text: string;
    /* Template */
    template: string;

    /* Global Colors */
    primary_color: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    hover_color: string;
    surface_color: string;
    muted_text_color: string;
    border_color: string;

    /* Project Card Colors */
    card_background_color: string;
    card_text_color: string;
    card_accent_color: string;
    card_primary_color: string;
    card_hover_color: string;

    /* Cover */
    cover_image_position_x: number;
    cover_image_position_y: number;
    cover_image_zoom: number;
    cover_image_offset_x: number;
    cover_image_offset_y: number;

    /* Hero */
    show_hero: boolean;
    hero_label: string | null;
    hero_statement: string | null;

    /* Work */
    show_work: boolean;
    work_label: string | null;
    work_description: string | null;

    /* About */
    show_about: boolean;
    about_label: string | null;

    /* Artist Message */
    show_artist_message: boolean;
    artist_message_label: string | null;
    artist_message: string | null;

    /* Gallery */
    show_gallery: boolean;
    gallery_label: string | null;
    gallery_description: string | null;

    gallery_display:
    | 'grid'
    | 'masonry'
    | 'editorial'
    | 'freeform';

    gallery_columns: number;

    gallery_image_aspect:
    | 'original'
    | 'square'
    | 'portrait'
    | 'landscape';

    gallery_responsive: GalleryResponsiveSettingsMap | null;

    gallery_show_captions: boolean;
    gallery_show_titles: boolean;
    gallery_enable_lightbox: boolean;

    gallery_images: PortfolioGalleryImage[];

    /* Music */
    show_music: boolean;
    music_label: string | null;
    music_release_display: 'latest' | 'all';
    music_release_limit: number;
    featured_release_id: number | null;
    show_music_links: boolean;
    music_description: string | null;

    /* Navigation */
    show_navigation: boolean;
    navigation_items: PortfolioNavigationItem[];

    /* Footer */
    show_footer: boolean;
    footer_label: string | null;
    footer_message: string | null;
    show_footer_socials: boolean;
    footer_logo: string | null;
    copyright_text: string | null;
    show_powered_by_lira: boolean;
}

export interface PortfolioProject {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;

    thumbnail_position_x: number;
    thumbnail_position_y: number;
    thumbnail_zoom: number;
    thumbnail_offset_x: number;
    thumbnail_offset_y: number;

    url: string | null;
}

export interface PortfolioRelease {
    id: number;
    title: string;
    release_type: string;
    artwork: string | null;
    release_date: string | null;
    description: string | null;

    spotify_url: string | null;
    apple_music_url: string | null;
    youtube_url: string | null;
    soundcloud_url: string | null;
    bandcamp_url: string | null;

    lyrics: string | null;
}

export interface SocialLink {
    id: number;
    platform: string;
    url: string;
    position: number;
    is_visible: boolean;
}
export interface PortfolioGalleryImage {
    id: number;
    image: string;
    title: string | null;
    caption: string | null;
    alt_text: string | null;
    sort_order: number;
}

export interface PortfolioProfile {
    avatar_zoom: number;
    avatar_position_y: number;
    avatar_position_x: number;
    username: string;
    display_name: string;
    bio: string | null;
    about_me: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;

    avatar: string | null;
    cover_image: string | null;

    social_links: SocialLink[];

    portfolio_settings: PortfolioSettings;
    projects: PortfolioProject[];
    releases: PortfolioRelease[];
}

export interface GalleryResponsiveSettings {
    display:
    | 'grid'
    | 'masonry'
    | 'editorial'
    | 'freeform';

    columns: number;

    image_aspect:
    | 'original'
    | 'square'
    | 'portrait'
    | 'landscape';
}

export interface GalleryResponsiveSettingsMap {
    desktop: GalleryResponsiveSettings;
    tablet: GalleryResponsiveSettings;
    mobile: GalleryResponsiveSettings;
}

export interface PortfolioProps {
    profile: PortfolioProfile;
}

export interface PortfolioNavigationItem {
    id?: number;
    label: string;
    destination: string;
    url: string | null;
    sort_order: number;
    is_visible: boolean;
}
