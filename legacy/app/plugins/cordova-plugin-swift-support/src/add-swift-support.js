/*
 * This hook adds all the needed config to implement a Cordova plugin with Swift.
 *
 *  - It adds a Bridging header importing Cordova/CDV.h if it's not already
 *    the case. Else it concats all the bridging headers in one single file.
 *
 *    /!\ Please be sure not naming your bridging header file 'Bridging-Header.h'
 *    else it won't be supported.
 *
 *  - It puts the ios deployment target to 7.0 in case your project would have a
 *    lesser one.
 *
 *  - It updates the ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES build setting to YES.
 *
 *  - It sets the SWIFT_VERSION build setting to '3.0'.
 */

var fs = require('fs');
var path = require('path');
var xcode = require('xcode');

module.exports = function (context) {
	var platformMetadata = context.requireCordovaModule('cordova-lib/src/cordova/platform_metadata');
	var projectRoot = context.opts.projectRoot;
	var glob = context.requireCordovaModule('glob');

	// This script has to be executed depending on the command line arguments, not
	// on the hook execution cycle.
	if ((context.hook === 'after_platform_add' && context.cmdLine.includes('platform add')) ||
		(context.hook === 'after_prepare' && context.cmdLine.includes('prepare')) ||
		(context.hook === 'after_plugin_add' && context.cmdLine.includes('plugin add'))) {
		platformMetadata.getPlatformVersions(projectRoot).then(function (platformVersions) {
			var IOS_MIN_DEPLOYMENT_TARGET = '7.0';
			var platformPath = path.join(projectRoot, 'platforms', 'ios');

			var bridgingHeaderPath;
			var bridgingHeaderContent;
			var projectName;
			var projectPath;
			var pluginsPath;
			var iosPlatformVersion;
			var pbxprojPath;
			var xcodeProject;

			var COMMENT_KEY = /_comment$/;
			var buildConfigs;
			var buildConfig;
			var configName;

			platformVersions.forEach(function (platformVersion) {
				if (platformVersion.platform === 'ios') {
					iosPlatformVersion = platformVersion.version;
				}
			});

			if (!iosPlatformVersion) {
				return;
			}

			projectName = getConfigParser(context, path.join(projectRoot, 'config.xml')).name();
			projectPath = path.join(platformPath, projectName);
			pbxprojPath = path.join(platformPath, projectName + '.xcodeproj', 'project.pbxproj');
			xcodeProject = xcode.project(pbxprojPath);
			pluginsPath = path.join(projectPath, 'Plugins');

			xcodeProject.parseSync();

			bridgingHeaderPath = getBridgingHeaderPath(context, projectPath, iosPlatformVersion);

			try {
				fs.statSync(bridgingHeaderPath);
			} catch (err) {
				// If the bridging header doesn't exist, we create it with the minimum
				// Cordova/CDV.h import.
				bridgingHeaderContent = ['//',
					'//  Use this file to import your target\'s public headers that you would like to expose to Swift.',
					'//',
					'#import <Cordova/CDV.h>'
				];
				fs.writeFileSync(bridgingHeaderPath, bridgingHeaderContent.join('\n'), {
					encoding: 'utf-8',
					flag: 'w'
				});
				xcodeProject.addHeaderFile('Bridging-Header.h');
			}

			buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();

			var bridgingHeaderProperty = '"$(PROJECT_DIR)/$(PROJECT_NAME)' + bridgingHeaderPath.split(projectPath)[1] + '"';

			for (configName in buildConfigs) {
				if (!COMMENT_KEY.test(configName)) {
					buildConfig = buildConfigs[configName];
					if (xcodeProject.getBuildProperty('SWIFT_OBJC_BRIDGING_HEADER', buildConfig.name) !== bridgingHeaderProperty) {
						xcodeProject.updateBuildProperty('SWIFT_OBJC_BRIDGING_HEADER', bridgingHeaderProperty, buildConfig.name);
						console.log('Update IOS build setting SWIFT_OBJC_BRIDGING_HEADER to:', bridgingHeaderProperty, 'for build configuration', buildConfig.name);
					}
				}
			}

			// Look for any bridging header defined in the plugin
			glob('**/*Bridging-Header*.h', {
				cwd: pluginsPath
			}, function (error, files) {
				var bridgingHeader = path.basename(bridgingHeaderPath);
				var headers = files.map(function (filePath) {
					return path.basename(filePath);
				});

				// if other bridging headers are found, they are imported in the
				// one already configured in the project.
				var content = fs.readFileSync(bridgingHeaderPath, 'utf-8');

				headers.forEach(function (header) {
					if (header !== bridgingHeader && (content.indexOf(header) !== -1)) {
						if (content.charAt(content.length - 1) !== '\n') {
							content += '\n';
						}
						content += '#import "' + header + '"\n';
						console.log('Importing', header, 'into', bridgingHeaderPath);
					}
				});
				fs.writeFileSync(bridgingHeaderPath, content, 'utf-8');

				for (configName in buildConfigs) {
					if (!COMMENT_KEY.test(configName)) {
						buildConfig = buildConfigs[configName];
						if (parseFloat(xcodeProject.getBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', buildConfig.name)) < parseFloat(IOS_MIN_DEPLOYMENT_TARGET)) {
							xcodeProject.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', IOS_MIN_DEPLOYMENT_TARGET, buildConfig.name);
							console.log('Update IOS project deployment target to:', IOS_MIN_DEPLOYMENT_TARGET, 'for build configuration', buildConfig.name);
						}

						if (xcodeProject.getBuildProperty('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES', buildConfig.name) !== 'YES') {
							xcodeProject.updateBuildProperty('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES', 'YES', buildConfig.name);
							console.log('Update IOS build setting ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES to: YES', 'for build configuration', buildConfig.name);
						}

						if (xcodeProject.getBuildProperty('LD_RUNPATH_SEARCH_PATHS', buildConfig.name) !== '"@executable_path/Frameworks"') {
							xcodeProject.updateBuildProperty('LD_RUNPATH_SEARCH_PATHS', '"@executable_path/Frameworks"', buildConfig.name);
							console.log('Update IOS build setting LD_RUNPATH_SEARCH_PATHS to: @executable_path/Frameworks', 'for build configuration', buildConfig.name);
						}

						if (typeof xcodeProject.getBuildProperty('SWIFT_VERSION', buildConfig.name) === 'undefined') {
							xcodeProject.updateBuildProperty('SWIFT_VERSION', '3.0', buildConfig.name);
							console.log('Update SWIFT version to', 3.0, buildConfig.name);
						}
					}
				}

				fs.writeFileSync(pbxprojPath, xcodeProject.writeSync());
			});
		});
	}
};

function getConfigParser(context, config) {
	var semver = context.requireCordovaModule('semver');
	var ConfigParser;

	if (semver.lt(context.opts.cordova.version, '5.4.0')) {
		ConfigParser = context.requireCordovaModule('cordova-lib/src/ConfigParser/ConfigParser');
	} else {
		ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser');
	}

	return new ConfigParser(config);
}

function getBridgingHeaderPath(context, projectPath, iosPlatformVersion) {
	var semver = context.requireCordovaModule('semver');
	var bridgingHeaderPath;
	if (semver.lt(iosPlatformVersion, '4.0.0')) {
		bridgingHeaderPath = path.posix.join(projectPath, 'Plugins', 'Bridging-Header.h');
	} else {
		bridgingHeaderPath = path.posix.join(projectPath, 'Bridging-Header.h');
	}

	return bridgingHeaderPath;
}
