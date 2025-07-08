export interface Invite {
    type:                       number;
    code:                       string;
    inviter?:                   Inviter;
    expires_at:                 null;
    guild:                      Guild;
    guild_id:                   string;
    channel:                    Channel;
    profile:                    Profile;
    approximate_member_count:   number;
    approximate_presence_count: number;
    uses:                       number;
    max_uses:                   number;
}

export interface Inviter {
    id:                     string;
    username:               string;
    avatar:                 string;
    discriminator:          string;
    public_flags:           number;
    flags:                  number;
    banner:                 string;
    accent_color:           number;
    global_name:            string;
    avatar_decoration_data: AvatarDecorationData;
    collectibles:           Collectibles;
    banner_color:           string;
    clan:                   Clan;
    primary_guild:          Clan;
}

export interface AvatarDecorationData {
    asset:      string;
    sku_id:     string;
    expires_at: null;
}

export interface Collectibles {
    nameplate: Nameplate;
}

export interface Nameplate {
    sku_id:  string;
    asset:   string;
    label:   string;
    palette: string;
}

export interface Clan {
    identity_guild_id: string;
    identity_enabled:  boolean;
    tag:               string;
    badge:             string;
}

export interface Channel {
    id:   string;
    type: number;
    name: string;
}

export interface Guild {
    id:                         string;
    name:                       string;
    splash:                     string | null;
    banner:                     string | null;
    description:                string;
    icon:                       string;
    features:                   string[];
    verification_level:         number;
    vanity_url_code:            string | null;
    nsfw_level:                 number;
    nsfw:                       boolean;
    premium_subscription_count: number;
    premium_tier:               number;
}

export interface Profile {
    id:                         string;
    name:                       string;
    icon_hash:                  string;
    member_count:               number;
    online_count:               number;
    description:                string;
    banner_hash:                string | null;
    game_application_ids:       any[];
    tag:                        string | null;
    badge:                      number;
    badge_color_primary:        string;
    badge_color_secondary:      string;
    badge_hash:                 string | null;
    traits:                     Trait[];
    features:                   string[];
    visibility:                 number;
    custom_banner_hash:         string | null;
    premium_subscription_count: number;
    premium_tier:               number;
}

export interface Trait {
    emoji_id:       null;
    emoji_name:     string;
    emoji_animated: boolean;
    label:          string;
    position:       number;
}
