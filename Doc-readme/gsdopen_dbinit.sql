-- --------------------------------------------------------
-- 主机:                           
-- 服务器版本:                        5.7.12 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Linux
-- HeidiSQL 版本:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出  表 recommender.biogref_dnb 结构
CREATE TABLE IF NOT EXISTS `biogref_dnb` (
  `person_id` varchar(128) DEFAULT NULL,
  `person_name` varchar(128) DEFAULT NULL,
  `born_year` varchar(128) DEFAULT NULL,
  `died_year` varchar(128) DEFAULT NULL,
  `gender` varchar(128) DEFAULT NULL,
  `dynasty` varchar(128) DEFAULT NULL,
  `jiguan` varchar(128) DEFAULT NULL,
  `shengfen` varchar(128) DEFAULT NULL,
  `shiqu` varchar(128) DEFAULT NULL,
  `lon_lat` varchar(128) DEFAULT NULL,
  `typeid` varchar(128) DEFAULT NULL,
  `libid` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.defined_category 结构
CREATE TABLE IF NOT EXISTS `defined_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(128) NOT NULL,
  `categoryid` varchar(128) NOT NULL,
  `categoryname` varchar(128) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=488 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.export_literature_record 结构
CREATE TABLE IF NOT EXISTS `export_literature_record` (
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `recordid` int(11) NOT NULL AUTO_INCREMENT COMMENT '导出id',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`recordid`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8 COMMENT='用户导出文献记录表  ';

-- 数据导出被取消选择。
-- 导出  表 recommender.export_literature_record_detail 结构
CREATE TABLE IF NOT EXISTS `export_literature_record_detail` (
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `recordid` int(11) NOT NULL COMMENT '导出id',
  `literatureid` varchar(64) NOT NULL COMMENT '文献id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户导出文献记录详情表 ';

-- 数据导出被取消选择。
-- 导出  表 recommender.gsd 结构
CREATE TABLE IF NOT EXISTS `gsd` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(50) DEFAULT NULL,
  `categoryid1` varchar(50) DEFAULT NULL,
  `categoryid2` varchar(50) DEFAULT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2053 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.gsdlib 结构
CREATE TABLE IF NOT EXISTS `gsdlib` (
  `categoryid` varchar(256) NOT NULL,
  `selfcategoryname` varchar(256) NOT NULL COMMENT 'es表资源属于哪个大分类',
  `libid` varchar(256) NOT NULL COMMENT 'es表index名称',
  `namecha` varchar(256) NOT NULL COMMENT 'es表中文名称',
  `nameeng` varchar(256) NOT NULL COMMENT 'es表英文名称',
  `type` int(11) NOT NULL COMMENT '类型',
  `wiki` varchar(1024) DEFAULT NULL COMMENT '资源wiki描述',
  PRIMARY KEY (`libid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='es库表基本信息表';

-- 数据导出被取消选择。
-- 导出  表 recommender.gsduser2 结构
CREATE TABLE IF NOT EXISTS `gsduser2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(128) DEFAULT NULL,
  `username` varchar(128) DEFAULT NULL,
  `opensearchrecord` tinyint(1) DEFAULT '0' COMMENT '保存浏览记录',
  `sharewebpage` tinyint(4) DEFAULT '0' COMMENT '开放索引',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.gsd_index 结构
CREATE TABLE IF NOT EXISTS `gsd_index` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `domainName` varchar(1024) NOT NULL,
  `tel` varchar(128) DEFAULT NULL,
  `email` varchar(1024) DEFAULT NULL,
  `wiki` varchar(1024) DEFAULT NULL,
  `message` varchar(1024) DEFAULT NULL,
  `updateType` varchar(128) DEFAULT NULL COMMENT '更新方式',
  `userId` varchar(128) NOT NULL,
  `update` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否更新',
  `csvurl` varchar(128) NOT NULL COMMENT '库的地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_comp_detail 结构
CREATE TABLE IF NOT EXISTS `literature_comp_detail` (
  `labelid` int(11) NOT NULL COMMENT '标签id',
  `literatureid` varchar(128) NOT NULL COMMENT '文献id',
  `type` varchar(28) NOT NULL COMMENT '文献类型 自有库还是外部库',
  `indexname` varchar(128) DEFAULT NULL COMMENT '索引名称 自有库查询时使用',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `labelid_literatureid` (`labelid`,`literatureid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文献对比详情表';

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_comp_label 结构
CREATE TABLE IF NOT EXISTS `literature_comp_label` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `labelname` varchar(128) NOT NULL COMMENT '标签名',
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `version` varchar(50) NOT NULL DEFAULT '0' COMMENT '版本字段，时间戳long',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_labelname` (`id`,`labelname`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8 COMMENT='文献对比标签表';

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_comp_lib_filed 结构
CREATE TABLE IF NOT EXISTS `literature_comp_lib_filed` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增，主键',
  `libid` varchar(64) NOT NULL COMMENT '库标识id',
  `filedid` varchar(64) NOT NULL COMMENT '字段在库中标识',
  `filednamecn` varchar(64) NOT NULL COMMENT '展示字段中文名称',
  `filednameen` varchar(64) NOT NULL COMMENT '展示字段英文名称',
  `orderlist` tinyint(3) DEFAULT '0' COMMENT '展示顺序（1，2，3，4...）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `libid_filedid` (`libid`,`filedid`)
) ENGINE=InnoDB AUTO_INCREMENT=460 DEFAULT CHARSET=utf8 COMMENT='文献对比中各个库展示对比字段表 ';

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_comp_show_set 结构
CREATE TABLE IF NOT EXISTS `literature_comp_show_set` (
  `labelid` int(11) NOT NULL COMMENT '文献对比标签id',
  `filedsnamecn` text NOT NULL COMMENT '展示字段中文名称集合 通过|分隔，分割内再以，分割 作者,author,0|出版社,publish,1  --0是不展示列，1展示',
  `filedids` text NOT NULL COMMENT '展示字段在库中标识集合 通过|分割，分割内再以，分割 title,basictitle,basic|publish',
  `updatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `version` varchar(50) NOT NULL DEFAULT '0' COMMENT '文献比较标签版本字段',
  UNIQUE KEY `labelid_userid` (`labelid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户某文献对比标签下上次设置对比展示字段表';

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_detail 结构
CREATE TABLE IF NOT EXISTS `literature_detail` (
  `literatureid` varchar(128) NOT NULL COMMENT '文献id',
  `content` text NOT NULL COMMENT '文献简报',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`literatureid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文献详情（超星库查询内容）';

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_down_detail 结构
CREATE TABLE IF NOT EXISTS `literature_down_detail` (
  `labelid` int(11) NOT NULL COMMENT '下载标签id',
  `literatureid` varchar(128) NOT NULL COMMENT '文献id',
  `type` char(2) NOT NULL DEFAULT '3' COMMENT '文献库类型',
  `indexname` varchar(128) NOT NULL COMMENT '文献库名称index',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `labelid_literatureid` (`labelid`,`literatureid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文献下载详情表  ';

-- 数据导出被取消选择。
-- 导出  表 recommender.literature_down_label 结构
CREATE TABLE IF NOT EXISTS `literature_down_label` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `labelname` varchar(128) NOT NULL COMMENT '标签名称',
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_labelname` (`id`,`labelname`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='文献下载标签表 ';

-- 数据导出被取消选择。
-- 导出  表 recommender.searchcontent 结构
CREATE TABLE IF NOT EXISTS `searchcontent` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(128) DEFAULT NULL,
  `content` varchar(128) DEFAULT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contentid` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `userid` (`userid`),
  KEY `content` (`content`)
) ENGINE=InnoDB AUTO_INCREMENT=117559 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.searchrecord 结构
CREATE TABLE IF NOT EXISTS `searchrecord` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(128) DEFAULT NULL,
  `content` varchar(128) DEFAULT NULL COMMENT '搜索内容',
  `title1` varchar(128) DEFAULT NULL COMMENT '一级标题',
  `title2` varchar(128) DEFAULT NULL COMMENT '二级标题',
  `url` varchar(512) DEFAULT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(128) DEFAULT NULL,
  `address` varchar(128) DEFAULT NULL COMMENT '地址',
  `point` varchar(128) DEFAULT NULL COMMENT '经纬度',
  `from` char(1) NOT NULL DEFAULT '1' COMMENT '1 浏览来自gsd web 2 浏览来自gsd app 3浏览来自第三方',
  PRIMARY KEY (`Id`),
  KEY `userid` (`userid`),
  KEY `content` (`content`)
) ENGINE=InnoDB AUTO_INCREMENT=115176 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.users 结构
CREATE TABLE IF NOT EXISTS `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  `Created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` timestamp NULL DEFAULT NULL,
  `level` int(11) DEFAULT '100',
  `Referfriend` int(11) DEFAULT '1' COMMENT '0:关闭推荐好友，1：开启',
  PRIMARY KEY (`Id`),
  KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=1000054 DEFAULT CHARSET=utf8;

-- 数据导出被取消选择。
-- 导出  表 recommender.user_file_detail 结构
CREATE TABLE IF NOT EXISTS `user_file_detail` (
  `fileid` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件id',
  `filetype` char(2) NOT NULL DEFAULT '0' COMMENT '文件类型（大类）1、文档 2、图片 3、视频 4、音频',
  `filesmallclass` char(3) NOT NULL DEFAULT '0' COMMENT '文件类型（小类）101 pdf 102 txt 103 doc 104 docx 105 ppt 106 xls 107 xlsx',
  `filename` varchar(128) NOT NULL COMMENT '文件名称',
  `fileurl` varchar(256) NOT NULL COMMENT '文件url',
  `filesize` bigint(20) NOT NULL DEFAULT '0' COMMENT '文件大小',
  `objectid` varchar(128) DEFAULT NULL COMMENT '文件id',
  `filefrom` char(2) DEFAULT '0' COMMENT '文件来源 1、中心云存储',
  `updatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`fileid`),
  KEY `fileurl_objectid` (`fileurl`,`objectid`)
) ENGINE=InnoDB AUTO_INCREMENT=491 DEFAULT CHARSET=utf8 COMMENT='用户资源详情表';

-- 数据导出被取消选择。
-- 导出  表 recommender.user_file_main 结构
CREATE TABLE IF NOT EXISTS `user_file_main` (
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `fileid` int(11) NOT NULL COMMENT '文件id',
  `extend` varchar(128) DEFAULT NULL COMMENT '扩展',
  KEY `userid_fileid` (`userid`,`fileid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户资源主表';

-- 数据导出被取消选择。
-- 导出  表 recommender.user_leaving_message 结构
CREATE TABLE IF NOT EXISTS `user_leaving_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '留言id',
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `username` varchar(128) NOT NULL COMMENT '用户名称',
  `type` char(1) NOT NULL DEFAULT '1' COMMENT '留言类型 1意见建议 2问题反馈 3合作 4其它 默认1',
  `level` char(1) NOT NULL DEFAULT '1' COMMENT '留言级别 1提示 2一般 3紧急 4严重 默认 1',
  `fromwhere` char(1) NOT NULL DEFAULT '1' COMMENT '留言来源 1gsd web 2 gsd app 默认1',
  `title` varchar(128) NOT NULL COMMENT '留言标题',
  `message` varchar(1024) NOT NULL COMMENT '留言内容',
  `qq` varchar(15) DEFAULT NULL COMMENT 'qq联系方式',
  `email` varchar(128) DEFAULT NULL COMMENT 'email',
  `ishandle` char(1) NOT NULL DEFAULT '0' COMMENT '是否处理 1处理 0未处理 默认0',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COMMENT='用户留言表';

-- 数据导出被取消选择。
-- 导出  表 recommender.user_mails 结构
CREATE TABLE IF NOT EXISTS `user_mails` (
  `userid` varchar(128) NOT NULL COMMENT '用户id',
  `mail` varchar(128) NOT NULL COMMENT '绑定邮箱',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户绑定的注册邮箱列表';

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
