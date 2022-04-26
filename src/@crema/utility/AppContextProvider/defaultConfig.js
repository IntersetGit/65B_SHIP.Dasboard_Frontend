import {
  FooterType,
  LayoutType,
  MenuStyle,
  NavStyle,
  ThemeDirection,
  ThemeMode,
  ThemeStyle,
} from '../../../shared/constants/AppEnums';

export const DarkSidebar = {
  sidebarBgColor: '#313541',
  sidebarTextColor: '#fff',
  sidebarHeaderColor: '#313541',
  sidebarMenuSelectedBgColor: '#F4F7FE',
  sidebarMenuSelectedTextColor: 'rgba(0, 0, 0, 0.87)',
  mode: ThemeMode.DARK,
};
export const LightSidebar = {
  sidebarBgColor: '#fff',
  sidebarTextColor: 'rgba(0, 0, 0, 0.60)',
  sidebarHeaderColor: '#fff',
  sidebarMenuSelectedBgColor: '#F4F7FE',
  sidebarMenuSelectedTextColor: 'rgba(0, 0, 0, 0.87)',
  mode: ThemeMode.LIGHT,
};
export const AunwaSidebar = {
  sidebarBgColor: "#5A63C8",
  sidebarHeaderColor: "#31A50",
  sidebarMenuSelectedBgColor: "rgba(126 ,163 ,255,1)",
  sidebarMenuSelectedTextColor: "rgba(45, 15, 15, 0.87)",
  sidebarTextColor: "#fff",
  mode: ThemeMode.DARK,
};

const defaultConfig = {
  sidebar: {
    borderColor: '#757575',
    menuStyle: MenuStyle.ROUNDED_REVERSE,
    isSidebarBgImage: false,
    sidebarBgImage: 1,
    colorSet: AunwaSidebar,
  },

  locale: {
    languageId: 'thailand',
    locale: 'th',
    name: 'Thailand',
    icon: 'us',
  },
  themeStyle: ThemeStyle.STANDARD,
  direction: ThemeDirection.LTR,
  themeMode: ThemeMode.SEMI_DARK,
  footerType: FooterType.FLUID,
  navStyle: NavStyle.MINI_SIDEBAR_TOGGLE,
  layoutType: LayoutType.FULL_WIDTH,
  footer: false,
  rtlLocale: ['ar'],
};
export default defaultConfig;
