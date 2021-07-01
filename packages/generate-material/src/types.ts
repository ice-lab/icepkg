export type EnvTypeMap = {
  web: 'isWeb';
  weex: 'isWeex';
  miniapp: 'isMiniApp';
  'wechat-miniprogram': 'isWechatMiniProgram';
  kraken: 'isKraken';
};

export interface ITemplateOptions {
  npmName: string; // @icedesign/ice-label
  name?: string; // ice-label (english and variable)
  kebabCaseName?: string; // ice-label
  npmScope?: string; // @icedesign
  title?: string; //
  description?: string;
  className?: string;
  version?: string;
  category?: string;
  // web, miniapp...
  projectTargets?: Array<keyof EnvTypeMap>;
  adaptor?: boolean;
  miniappComponentBuildType?: 'runtime' | 'compile'; // miniapp build type
  isAliInternal?: boolean;
}

export interface IOptions {
  rootDir: string;
  materialTemplateDir: string;
  templateOptions: ITemplateOptions;
  enablePegasus?: boolean;
  enableDefPublish?: boolean;
  materialType: 'component' | 'block' | 'scaffold';
}
