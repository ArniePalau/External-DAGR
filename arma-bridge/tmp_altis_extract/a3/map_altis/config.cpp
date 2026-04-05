////////////////////////////////////////////////////////////////////
//DeRap: config.bin
//Produced from mikero's Dos Tools Dll version 10.13
//https://mikero.bytex.digital/Downloads
//'now' is Thu Apr 02 17:49:38 2026 : 'file' last modified on Tue Feb 11 16:57:22 2020
////////////////////////////////////////////////////////////////////

#define _ARMA_

//(13 Enums)
enum {
	destructengine = 2,
	destructdefault = 6,
	destructwreck = 7,
	destructtree = 3,
	destructtent = 4,
	stabilizedinaxisx = 1,
	stabilizedinaxesxyz = 4,
	stabilizedinaxisy = 2,
	stabilizedinaxesboth = 3,
	destructno = 0,
	stabilizedinaxesnone = 0,
	destructman = 5,
	destructbuilding = 1
};

class CfgPatches
{
	class A3_Map_Altis
	{
		author = "$STR_A3_Bohemia_Interactive";
		name = "Arma 3 - Altis Map Terrain";
		url = "https://www.arma3.com";
		requiredAddons[] = {"A3_Data_F","A3_Map_Data"};
		requiredVersion = 0.1;
		units[] = {};
		weapons[] = {};
	};
};
class CfgVehicles{};
class CfgWorlds
{
	mapSize = 30720;
	mapZone = 35;
	mapArea[] = {25.011957,39.718452,25.481527,40.094578};
	class DefaultWorld
	{
		class Weather
		{
			class Overcast;
		};
		class WaterExPars;
	};
	class CAWorld: DefaultWorld
	{
		class Grid{};
		class DayLightingBrightAlmost;
		class DayLightingRainy;
		class DefaultClutter;
		class Weather: Weather
		{
			class Lighting;
			class Overcast: Overcast
			{
				class Weather1;
				class Weather2;
				class Weather3;
				class Weather4;
				class Weather5;
				class Weather6;
			};
		};
	};
	class DefaultLighting;
	class Altis: CAWorld
	{
		class DefaultClutter;
		class clutter
		{
			class StrBigFallenBranches_pine: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_bigFallenBranches_pine.p3d";
				affectedByWind = 0.0;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 0.7;
			};
			class StrBigFallenBranches_pine02: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_bigFallenBranches_pine02.p3d";
				affectedByWind = 0.0;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 0.7;
			};
			class StrBigFallenBranches_pine03: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_bigFallenBranches_pine03.p3d";
				affectedByWind = 0.0;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 0.7;
			};
			class StrGrassGreenGroup: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrGrassGreen_group.p3d";
				affectedByWind = 0.6;
				swLighting = 1;
				scaleMin = 0.7;
				scaleMax = 1.0;
			};
			class StrGrassDry: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrGrassDry.p3d";
				affectedByWind = 0.5;
				swLighting = 1;
				scaleMin = 0.8;
				scaleMax = 1.2;
			};
			class StrGrassDryGroup: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrGrassDry_group.p3d";
				affectedByWind = 0.65;
				swLighting = 1;
				scaleMin = 0.65;
				scaleMax = 1.0;
			};
			class StrGrassDryMediumGroup: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrGrassDryMedium_group.p3d";
				affectedByWind = 0.7;
				swLighting = 1;
				scaleMin = 0.8;
				scaleMax = 1.0;
			};
			class StrThornKhakiSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThornKhaki.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.5;
				scaleMax = 0.7;
			};
			class StrThornKhakiBig: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThornKhaki.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.7;
				scaleMax = 0.9;
			};
			class StrThornGreenSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThornGreen.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 0.5;
			};
			class StrThornGreenBig: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThornGreen.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.7;
				scaleMax = 0.9;
			};
			class StrThornGraySmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThornGray.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.5;
				scaleMax = 0.7;
			};
			class StrThornGrayBig: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThornGray.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.8;
				scaleMax = 1.2;
			};
			class StrPlantGreenShrub: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrPlantGreenShrub.p3d";
				affectedByWind = 0.5;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 1.1;
			};
			class StrPlantGermaderGroup: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrPlantGermader_group.p3d";
				affectedByWind = 0.35;
				swLighting = 1;
				scaleMin = 0.9;
				scaleMax = 1.5;
			};
			class StrWeedBrownTallGroup: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrWeedBrownTall_group.p3d";
				affectedByWind = 0.3;
				swLighting = 1;
				scaleMin = 0.9;
				scaleMax = 1.25;
			};
			class StrWeedGreenTall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrWeedGreenTall.p3d";
				affectedByWind = 0.3;
				swLighting = 1;
				scaleMin = 0.8;
				scaleMax = 1.2;
			};
			class StrPlantMullein: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrPlantMullein.p3d";
				affectedByWind = 0.35;
				swLighting = 1;
				scaleMin = 0.7;
				scaleMax = 1.15;
			};
			class StrThistlePurpleSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThistlePurple_small.p3d";
				affectedByWind = 0.1;
				swLighting = 1;
				scaleMin = 0.9;
				scaleMax = 1.4;
			};
			class StrThistleSmallYellow: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThistleSmallYellow.p3d";
				affectedByWind = 0.2;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 1.4;
			};
			class StrThistleYellowShrub: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_StrThistleYellowShrub.p3d";
				affectedByWind = 0.2;
				swLighting = 1;
				scaleMin = 0.7;
				scaleMax = 1.1;
			};
			class GrassTall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Grass_Tall_Dead.p3d";
				affectedByWind = 1.0;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 1.0;
			};
			class GrassGreen: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Grass_Green.p3d";
				affectedByWind = 1.0;
				swLighting = 1;
				scaleMin = 0.85;
				scaleMax = 1.0;
				surfaceColor[] = {0.431,0.475,0.267};
			};
			class GrassDry: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Grass_Dry.p3d";
				affectedByWind = 1.0;
				swLighting = 1;
				scaleMin = 0.3;
				scaleMax = 0.9;
			};
			class GrassBrushHighGreen: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Grass_BrushHigh_Green.p3d";
				affectedByWind = 0.8;
				swLighting = 1;
				scaleMin = 0.5;
				scaleMax = 0.7;
			};
			class GrassBunchSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Grass_Bunch_Small.p3d";
				affectedByWind = 0.8;
				swLighting = 1;
				scaleMin = 0.3;
				scaleMax = 0.8;
			};
			class ThistleHighDead: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_High_Dead.p3d";
				affectedByWind = 1.0;
				swLighting = 1;
				scaleMin = 0.4;
				scaleMax = 0.8;
			};
			class ThistleHigh: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_High.p3d";
				affectedByWind = 0.6;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 1.0;
			};
			class ThistleSmallYellow: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Small_Yellow.p3d";
				affectedByWind = 0.3;
				swLighting = 1;
				scaleMin = 0.3;
				scaleMax = 0.9;
			};
			class ThistleThornGreen: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Thorn_Green.p3d";
				affectedByWind = 0.3;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 1.0;
			};
			class ThistleThornGreenSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Thorn_Green.p3d";
				affectedByWind = 0.25;
				swLighting = 0;
				scaleMin = 0.4;
				scaleMax = 0.7;
			};
			class ThistleThornBrown: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Thorn_Brown.p3d";
				affectedByWind = 0.3;
				swLighting = 0;
				scaleMin = 0.5;
				scaleMax = 1.2;
			};
			class ThistleThornBrownSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Thorn_Brown.p3d";
				affectedByWind = 0.25;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 0.7;
			};
			class ThistleThornGray: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Thorn_Gray.p3d";
				affectedByWind = 0.3;
				swLighting = 0;
				scaleMin = 1.1;
				scaleMax = 1.4;
			};
			class ThistleThornDesert: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Thistle_Thorn_Desert.p3d";
				affectedByWind = 0.3;
				swLighting = 0;
				scaleMin = 0.4;
				scaleMax = 1.4;
			};
			class PlantGreenSmall: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Plant_Green_Small.p3d";
				affectedByWind = 0.7;
				swLighting = 1;
				scaleMin = 0.5;
				scaleMax = 1.1;
			};
			class FlowerCakile: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Flower_Cakile.p3d";
				affectedByWind = 0.4;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 0.8;
			};
			class FlowerLowYellow2: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_Flower_Low_Yellow2.p3d";
				affectedByWind = 0.4;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 1.0;
			};
			class GrassCrookedDead: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_GrassCrooked.p3d";
				affectedByWind = 0.6;
				swLighting = 1;
				scaleMin = 0.8;
				scaleMax = 1.1;
			};
			class GrassTalltwo: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_GrassTall.p3d";
				affectedByWind = 0.8;
				swLighting = 1;
				scaleMin = 0.75;
				scaleMax = 1.15;
			};
			class GrassLong_DryBunch: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_GrassLong_DryBunch.p3d";
				affectedByWind = 0.8;
				swLighting = 1;
				scaleMin = 0.9;
				scaleMax = 1.2;
			};
			class GrassDesertGroupSoft: DefaultClutter
			{
				model = "A3\plants_f\Clutter\c_GrassGreen_GroupSoft.p3d";
				affectedByWind = 1.0;
				swLighting = 1;
				scaleMin = 0.6;
				scaleMax = 1.1;
			};
			class SeaWeed1: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_SeaWeed1.p3d";
				affectedByWind = 0.2;
				swLighting = 0;
				scaleMin = 0.4;
				scaleMax = 1.0;
			};
			class SeaWeed2: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_SeaWeed2.p3d";
				affectedByWind = 0.2;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 1.0;
			};
			class Coral1: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_Coral1.p3d";
				affectedByWind = 0.0;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 1.0;
			};
			class Coral2: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_Coral2.p3d";
				affectedByWind = 0.0;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 1.0;
			};
			class Coral3: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_Coral3.p3d";
				affectedByWind = 0.1;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 0.5;
			};
			class Coral4: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_Coral4.p3d";
				affectedByWind = 0.1;
				swLighting = 0;
				scaleMin = 0.3;
				scaleMax = 1.0;
			};
			class Coral5: DefaultClutter
			{
				model = "A3\Plants_F\Clutter\c_Coral5.p3d";
				affectedByWind = 0.05;
				swLighting = 0;
				scaleMin = 0.2;
				scaleMax = 0.6;
			};
		};
		dynLightMinBrightnessAmbientCoef = 0.5;
		dynLightMinBrightnessAbsolute = 0.05;
		class Sea
		{
			seaTexture = "a3\data_f\seatexture_co.paa";
			seaMaterial = "#water";
			shoreMaterial = "#shore";
			shoreFoamMaterial = "#shorefoam";
			shoreWetMaterial = "#shorewet";
			WaterMapScale = 20;
			WaterGrid = 50;
			MaxTide = 0.0;
			MaxWave = 0.25;
			SeaWaveXScale = "2.0/50";
			SeaWaveZScale = "1.0/50";
			SeaWaveHScale = 1.0;
			SeaWaveXDuration = 5000;
			SeaWaveZDuration = 10000;
		};
		class Underwater
		{
			noWaterFog = -0.001;
			fullWaterFog = 0.001;
			deepWaterFog = 200;
			waterFogDistanceNear = 10;
			waterFogDistance = 40;
			waterColor[] = {0.04,0.16,0.22};
			deepWaterColor[] = {0.0,0.001,0.009};
			surfaceColor[] = {0.04,0.16,0.22};
			deepSurfaceColor[] = {0.0,0.001,0.009};
		};
		class SeaWaterShaderPars
		{
			refractionMoveCoef = 0.03;
			minWaterOpacity = 0.0;
			waterOpacityDistCoef = 0.4;
			underwaterOpacity = 0.5;
			waterOpacityFadeStart = 60;
			waterOpacityFadeLength = 120;
		};
		class WaterExPars: WaterExPars
		{
			fogDensity = 0.07;
			fogColor[] = {0.03015,0.07155,0.09045};
			fogColorExtinctionSpeed[] = {0.1814,0.0159,0.0111};
			ligtExtinctionSpeed[] = {0.1814,0.0159,0.0111};
			diffuseLigtExtinctionSpeed[] = {0.3814,0.2159,0.2111};
			fogGradientCoefs[] = {0.35,1.0,1.7};
			fogColorLightInfluence[] = {0.8,0.2,1.0};
			shadowIntensity = 0.0;
			ssReflectionStrength = 0.85;
			ssReflectionMaxJitter = 1.0;
			ssReflectionRippleInfluence = 0.2;
			ssReflectionEdgeFadingCoef = 10.0;
			ssReflectionDistFadingCoef = 4.0;
			refractionMinCoef = 0.03;
			refractionMaxCoef = 0.14;
			refractionMaxDist = 5.1;
			specularMaxIntensity = 100;
			specularPowerOvercast0 = 750;
			specularPowerOvercast1 = 50;
			specularNormalModifyCoef = 0.015;
			foamAroundObjectsIntensity = 0.15;
			foamAroundObjectsFadeCoef = 8.0;
			foamColorCoef = 2.0;
			foamDeformationCoef = 0.02;
			foamTextureCoef = 0.2;
			foamTimeMoveSpeed = 0.2;
			foamTimeMoveAmount = 0.1;
			shoreDarkeningMaxCoef = 0.45;
			shoreDarkeningOffset = 0.36;
			shoreDarkeningGradient = 0.08;
			shoreWaveTimeScale = 0.8;
			shoreWaveShifDerivativeOffset = -0.8;
			shoreFoamIntensity = 0.25;
			shoreMaxWaveHeight = 0.15;
			shoreWetLayerReflectionIntensity = 0.55;
		};
		startWeather = 0.3;
		startFog = 0.0;
		forecastWeather = 0.3;
		forecastFog = 0.0;
		startFogBase = 0.0;
		forecastFogBase = 0.0;
		startFogDecay = 0.014;
		forecastFogDecay = 0.014;
		fogBeta0Min = 0.0;
		fogBeta0Max = 0.05;
		class HDRNewPars
		{
			minAperture = 1e-05;
			maxAperture = 256;
			apertureRatioMax = 4;
			apertureRatioMin = 10;
			bloomImageScale = 1.0;
			bloomScale = 0.09;
			bloomExponent = 0.75;
			bloomLuminanceOffset = 0.4;
			bloomLuminanceScale = 0.15;
			bloomLuminanceExponent = 0.25;
			tonemapMethod = 1;
			tonemapShoulderStrength = 0.22;
			tonemapLinearStrength = 0.12;
			tonemapLinearAngle = 0.1;
			tonemapToeStrength = 0.2;
			tonemapToeNumerator = 0.022;
			tonemapToeDenominator = 0.2;
			tonemapLinearWhite = 11.2;
			tonemapExposureBias = 1.0;
			tonemapLinearWhiteReinhard = "2.5f";
			eyeAdaptFactorLight = 3.3;
			eyeAdaptFactorDark = 0.75;
			nvgApertureMin = 10.0;
			nvgApertureStandard = 12.5;
			nvgApertureMax = 16.5;
			nvgStandardAvgLum = 10;
			nvgLightGain = 320;
			nvgTransition = 1;
			nvgTransitionCoefOn = "40.0f";
			nvgTransitionCoefOff = "0.01f";
			nightShiftMinAperture = 0;
			nightShiftMaxAperture = 0.002;
			nightShiftMaxEffect = 0.6;
			nightShiftLuminanceScale = 600;
		};
		skyColorInfluencesFogColor = 0;
		class Lighting: DefaultLighting
		{
			groundReflection[] = {0.132,0.133,0.122};
			moonObjectColorFull[] = {460,440,400,1.0};
			moonHaloObjectColorFull[] = {465,477,475,1.0};
			moonsetObjectColor[] = {375,350,325,1.0};
			moonsetHaloObjectColor[] = {515,517,525,1.0};
			class ThunderBoltLight
			{
				diffuse[] = {2120,3170,5550};
				ambient[] = {0.001,0.001,0.001};
				intensity = 120000;
				class Attenuation
				{
					start = 0.0;
					constant = 0.0;
					linear = 0.0;
					quadratic = 1.0;
				};
			};
			starEmissivity = 25;
		};
		class DayLightingBrightAlmost: DayLightingBrightAlmost
		{
			deepNight[] = {-15,{0.005,0.01,0.01},{0.0,0.002,0.003},{0.0,0.0,0.0},{0.0,0.0,0.0},{0.0,0.002,0.003},{0.0,0.002,0.003},0};
			fullNight[] = {-5,{0.182,0.213,0.25},{0.05,0.111,0.221},{0.04,0.034,0.004},{0.039,0.049,0.072},{0.082,0.128,0.185},{0.283,0.35,0.431},0};
			sunMoon[] = {-3.75,{0.377,0.441,0.518},{0.103,0.227,0.453},{0.04,0.034,0.004},{0.039,0.049,0.072},{0.174,0.274,0.395},{0.582,0.72,0.887},0.5};
			earlySun[] = {-2.5,{0.675,0.69,0.784},{0.22,0.322,0.471},{0.04,0.034,0.004},{0.039,0.049,0.072},{0.424,0.549,0.745},{0.698,0.753,0.894},1};
			sunrise[] = {0,{0.675,0.69,0.784},{0.478,0.51,0.659},{0.2,0.19,0.07},{0.124,0.161,0.236},{{0.847,0.855,0.965},0.2},{{0.933,0.949,0.996},2},1};
			earlyMorning[] = {3,{{0.844,0.61,0.469},0.8},{0.424,0.557,0.651},{{1,0.45,0.2},1},{0.12,0.26,0.38},{{0.428,0.579,0.743},2},{{0.844,0.61,0.469},2.7},1};
			midMorning[] = {8,{{0.822,0.75,0.646},3.8},{{0.383,0.58,0.858},1.3},{{1.3,0.9,0.61},2.8},{{0.12,0.18,0.28},0.5},{{0.322,0.478,0.675},3.5},{{1.0,0.929,0.815},4.7},1};
			morning[] = {16,{{1,0.95,0.91},12.2},{{0.12,0.18,0.28},9.2},{{1,0.95,0.91},11.2},{{0.12,0.18,0.28},8.5},{{0.14,0.18,0.24},11.0},{{0.5,0.6,0.9},13.2},1};
			noon[] = {45,{{0.98,0.94,0.94},13.8},{{0.2,0.27,0.35},10.8},{{0.98,0.94,0.94},13.8},{{0.2,0.27,0.35},10.8},{{0.5,0.64,1.0},12.0},{{0.5,0.5,0.5},14.8},1,0.5,0.4,0.5,0.4};
		};
		class DayLightingRainy: DayLightingRainy
		{
			deepNight[] = {-15,{0.005,0.01,0.01},{0.0,0.002,0.003},{0.0,0.0,0.0},{0.0,0.0,0.0},{0.0,0.002,0.003},{0.0,0.002,0.003},0};
			fullNight[] = {-5,{0.023,0.023,0.023},{0.02,0.02,0.02},{0.023,0.023,0.023},{0.02,0.02,0.02},{0.01,0.01,0.02},{0.08,0.06,0.06},0};
			sunMoon[] = {-3.75,{0.04,0.04,0.05},{0.04,0.04,0.05},{0.04,0.04,0.05},{0.04,0.04,0.05},{0.04,0.035,0.04},{0.11,0.08,0.09},0.5};
			earlySun[] = {-2.5,{0.0689,0.0689,0.0804},{0.06,0.06,0.07},{0.0689,0.0689,0.0804},{0.06,0.06,0.07},{0.08,0.07,0.08},{0.14,0.1,0.12},0.5};
			earlyMorning[] = {3,{{1,1,1},"(-4)+3.95"},{{1,1,1},"(-4)+3.0"},{{1,1,1},"(-4)+3.95"},{{1,1,1},"(-4)+3.0"},{{1,1,1},"(-4)+4"},{{1,1,1},"(-4)+5.5"},1};
			morning[] = {16,{{1,1,1},"(-4)+5.7"},{{1,1,1},"(-4)+4.5"},{{1,1,1},"(-4)+5.7"},{{1,1,1},"(-4)+4.5"},{{1,1,1},"(-4)+7"},{{1,1,1},"(-4)+8"},1};
			lateMorning[] = {25,{{1,1,1},"(-4)+10.45"},{{1,1,1},"(-4)+9.75"},{{1,1,1},"(-4)+10.45"},{{1,1,1},"(-4)+9.75"},{{1,1,1},"(-4)+12"},{{1,1,1},"(-4)+12.75"},1};
			noon[] = {45,{{1,1,1},10.0},{{1,1,1},9.0},{{1,1,1},9.0},{{1,1,1},8.0},{{0.5,0.64,1},12.0},{{0.5,0.5,0.5},14.8},1};
		};
		class Weather: Weather
		{
			class LightingNew
			{
				class Lighting0
				{
					height = 0;
					overcast = 0.25;
					sunAngle = -24;
					sunOrMoon = 0;
					diffuse[] = {{0.14,0.19,0.3},4};
					diffuseCloud[] = {{0.14,0.19,0.3},0.2};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},0.05};
					ambientMid[] = {{0.1384,0.1912,0.2984},0.88};
					ambientMidCloud[] = {{0.1384,0.1912,0.2984},0.044};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.04224};
					bidirect[] = {0.025,0.025,0.023};
					bidirectCloud[] = {0.0125,0.0125,0.0115};
					sky[] = {0.231,0.314,0.467};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {{0.09,0.137,0.22},0.025};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{0.5,0.65,1},11.016};
					swBrightness = 1;
				};
				class Lighting1
				{
					height = 0;
					overcast = 0.25;
					sunAngle = -12;
					sunOrMoon = 0;
					diffuse[] = {0.1,0.18,0.3};
					diffuseCloud[] = {0.1,0.18,0.3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.173,0.239,0.373},0.88};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {{0.094,0.141,0.231},0.025};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting2
				{
					height = 0;
					overcast = 0.25;
					sunAngle = -11;
					sunOrMoon = 0.5;
					diffuse[] = {0.1,0.18,0.3};
					diffuseCloud[] = {0.1,0.18,0.3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.173,0.239,0.373},0.88};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {{0.094,0.141,0.231},0.025};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting3
				{
					height = 0;
					overcast = 0.25;
					sunAngle = -10;
					sunOrMoon = 1;
					diffuse[] = {0.1,0.18,0.3};
					diffuseCloud[] = {0.1,0.18,0.3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.173,0.239,0.373},0.88};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {{0.2,0.25,0.45},4.734908};
					fogColor[] = {{0.094,0.141,0.231},0.025};
					apertureMin = 4;
					apertureStandard = 5;
					apertureMax = 10;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting4
				{
					height = 0;
					overcast = 0.25;
					sunAngle = -5;
					sunOrMoon = 1;
					diffuse[] = {{0.16,0.18,0.28},3};
					diffuseCloud[] = {{0.16,0.18,0.28},3};
					ambient[] = {{0.173,0.239,0.373},4.6};
					ambientCloud[] = {{0.173,0.239,0.373},4.6};
					ambientMid[] = {{0.173,0.239,0.373},4.048};
					ambientMidCloud[] = {{0.173,0.239,0.373},4.048};
					groundReflection[] = {{0.173,0.239,0.373},3.88608};
					groundReflectionCloud[] = {{0.173,0.239,0.373},3.88608};
					bidirect[] = {0.0115,0.012,0.0125};
					bidirectCloud[] = {0.0115,0.012,0.0125};
					sky[] = {{0.2,0.298,0.541},4.6};
					skyAroundSun[] = {{0.7,0.35,0.28},7.636949};
					fogColor[] = {{0.106,0.161,0.267},4.715};
					apertureMin = 5;
					apertureStandard = 6;
					apertureMax = 18;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting5
				{
					height = 0;
					overcast = 0.25;
					sunAngle = -2;
					sunOrMoon = 1;
					diffuse[] = {{0.25,0.21,0.2},5};
					diffuseCloud[] = {{0.25,0.21,0.2},5};
					ambient[] = {{0.196,0.275,0.42},6.9};
					ambientCloud[] = {{0.196,0.275,0.42},6.9};
					ambientMid[] = {{0.196,0.275,0.42},6.072};
					ambientMidCloud[] = {{0.196,0.275,0.42},6.072};
					groundReflection[] = {{0.196,0.275,0.42},5.82912};
					groundReflectionCloud[] = {{0.196,0.275,0.42},5.82912};
					bidirect[] = {0.023,0.024,0.025};
					bidirectCloud[] = {0.023,0.024,0.025};
					sky[] = {{0.188,0.29,0.576},6.9};
					skyAroundSun[] = {{1.8,0.42,0.2},12.31766};
					fogColor[] = {{0.11,0.169,0.286},7.0725};
					apertureMin = 6;
					apertureStandard = 8;
					apertureMax = 20;
					standardAvgLum = 20;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting6
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 0;
					sunOrMoon = 1;
					diffuse[] = {{0.75,0.38,0.22},6};
					diffuseCloud[] = {{0.75,0.38,0.22},6};
					ambient[] = {{0.2497,0.31,0.467},7.8};
					ambientCloud[] = {{0.2497,0.31,0.467},7.8};
					ambientMid[] = {{0.2541,0.314,0.467},6.864};
					ambientMidCloud[] = {{0.2541,0.314,0.467},6.864};
					groundReflection[] = {{0.235,0.318,0.467},6.58944};
					groundReflectionCloud[] = {{0.235,0.318,0.467},6.58944};
					bidirect[] = {0.023,0.024,0.025};
					bidirectCloud[] = {0.023,0.024,0.025};
					sky[] = {{0.173,0.282,0.612},7.8};
					skyAroundSun[] = {{2,0.42,0.2},13.38876};
					fogColor[] = {{0.118,0.18,0.31},7.995};
					apertureMin = 7;
					apertureStandard = 9;
					apertureMax = 22;
					standardAvgLum = 45;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting7
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 2;
					sunOrMoon = 1;
					diffuse[] = {{0.95,0.42,0.22},8.4};
					diffuseCloud[] = {{0.95,0.42,0.22},8.4};
					ambient[] = {{0.306,0.357,0.463},8.4};
					ambientCloud[] = {{0.306,0.357,0.463},8.4};
					ambientMid[] = {{0.365,0.361,0.396},7.392};
					ambientMidCloud[] = {{0.365,0.361,0.396},7.392};
					groundReflection[] = {{0.416,0.38,0.388},7.09632};
					groundReflectionCloud[] = {{0.416,0.38,0.388},7.09632};
					bidirect[] = {0.023,0.024,0.025};
					bidirectCloud[] = {0.023,0.024,0.025};
					sky[] = {{0.157,0.275,0.651},8.4};
					skyAroundSun[] = {{2.2,0.8,0.2},13.38876};
					fogColor[] = {{0.125,0.192,0.329},8.61};
					apertureMin = 8;
					apertureStandard = 10;
					apertureMax = 24;
					standardAvgLum = 50;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting8
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 6;
					sunOrMoon = 1;
					diffuse[] = {{0.95,0.55,0.35},10.2};
					diffuseCloud[] = {{0.95,0.55,0.35},10.2};
					ambient[] = {{0.337,0.404,0.525},9.6};
					ambientCloud[] = {{0.337,0.404,0.525},9.6};
					ambientMid[] = {{0.412,0.408,0.443},8.448};
					ambientMidCloud[] = {{0.412,0.408,0.443},8.448};
					groundReflection[] = {{0.475,0.435,0.431},8.11008};
					groundReflectionCloud[] = {{0.475,0.435,0.431},8.11008};
					bidirect[] = {0.01375,0.0132,0.01265};
					bidirectCloud[] = {0.01375,0.0132,0.01265};
					sky[] = {{0.145,0.263,0.686},9.6};
					skyAroundSun[] = {{0.4,0.32,0.6},13.38876};
					fogColor[] = {{0.133,0.204,0.357},9.84};
					apertureMin = 8;
					apertureStandard = 16;
					apertureMax = 26;
					standardAvgLum = 100;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.027,0.045};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting9
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 12;
					sunOrMoon = 1;
					diffuse[] = {{1,0.65,0.45},12.3};
					diffuseCloud[] = {{1,0.65,0.45},12.3};
					ambient[] = {{0.388,0.471,0.612},10.9};
					ambientCloud[] = {{0.388,0.471,0.612},10.9};
					ambientMid[] = {{0.482,0.475,0.506},9.81};
					ambientMidCloud[] = {{0.482,0.475,0.506},9.81};
					groundReflection[] = {{0.557,0.51,0.494},9.4176};
					groundReflectionCloud[] = {{0.557,0.51,0.494},9.4176};
					bidirect[] = {0.01875,0.018,0.01725};
					bidirectCloud[] = {0.01875,0.018,0.01725};
					sky[] = {{0.129,0.259,0.722},10.9};
					skyAroundSun[] = {{0.13,0.25,0.8},13.524};
					fogColor[] = {{0.145,0.224,0.396},11.1725};
					apertureMin = 20;
					apertureStandard = 25;
					apertureMax = 35;
					standardAvgLum = 250;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.018,0.04};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},12.24};
					swBrightness = 1;
				};
				class Lighting10
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 24;
					sunOrMoon = 1;
					diffuse[] = {{1,0.75,0.62},15.8};
					diffuseCloud[] = {{1,0.75,0.62},15.8};
					ambient[] = {{0.435,0.533,0.698},13.8};
					ambientCloud[] = {{0.435,0.533,0.698},13.8};
					ambientMid[] = {{0.545,0.541,0.569},12.696};
					ambientMidCloud[] = {{0.545,0.541,0.569},12.696};
					groundReflection[] = {{0.635,0.58,0.557},12.18816};
					groundReflectionCloud[] = {{0.635,0.58,0.557},12.18816};
					bidirect[] = {0.025,0.024,0.018};
					bidirectCloud[] = {0.025,0.024,0.018};
					sky[] = {{0.118,0.251,0.753},13.8};
					skyAroundSun[] = {{0.115,0.245,0.8},13.662};
					fogColor[] = {{0.15,0.251,0.488},14.145};
					apertureMin = 45;
					apertureStandard = 60;
					apertureMax = 80;
					standardAvgLum = 800;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.4};
					swBrightness = 1;
				};
				class Lighting11
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 45;
					sunOrMoon = 1;
					diffuse[] = {{1,0.87,0.85},17.2};
					diffuseCloud[] = {{1,0.87,0.85},17.2};
					ambient[] = {{0.498,0.602,0.77},14.8};
					ambientCloud[] = {{0.498,0.602,0.77},14.8};
					ambientMid[] = {{0.635,0.635,0.663},14.504};
					ambientMidCloud[] = {{0.635,0.635,0.663},14.504};
					groundReflection[] = {{0.745,0.671,0.643},14.21392};
					groundReflectionCloud[] = {{0.745,0.671,0.643},14.21392};
					bidirect[] = {0.025,0.024,0.018};
					bidirectCloud[] = {0.025,0.024,0.018};
					sky[] = {{0.02,0.12,0.8},13.8};
					skyAroundSun[] = {{0.02,0.12,0.8},13.8};
					fogColor[] = {{0.3,0.44,0.74},15};
					apertureMin = 70;
					apertureStandard = 120;
					apertureMax = 120;
					standardAvgLum = 8000;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting12
				{
					height = 0;
					overcast = 0.25;
					sunAngle = 90;
					sunOrMoon = 1;
					diffuse[] = {{1,0.87,0.85},17.2};
					diffuseCloud[] = {{1,0.87,0.85},17.2};
					ambient[] = {{0.498,0.602,0.77},14.8};
					ambientCloud[] = {{0.498,0.602,0.77},14.8};
					ambientMid[] = {{0.635,0.635,0.663},14.504};
					ambientMidCloud[] = {{0.635,0.635,0.663},14.504};
					groundReflection[] = {{0.745,0.671,0.643},14.21392};
					groundReflectionCloud[] = {{0.745,0.671,0.643},14.21392};
					bidirect[] = {0.025,0.024,0.018};
					bidirectCloud[] = {0.025,0.024,0.018};
					sky[] = {{0.02,0.12,0.8},13.8};
					skyAroundSun[] = {{0.02,0.12,0.8},13.8};
					fogColor[] = {{0.3,0.44,0.74},15};
					apertureMin = 70;
					apertureStandard = 120;
					apertureMax = 120;
					standardAvgLum = 8000;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting13
				{
					height = 0;
					overcast = 0.6;
					sunAngle = -24;
					sunOrMoon = 0;
					diffuse[] = {{0.14,0.19,0.3},4};
					diffuseCloud[] = {{0.14,0.19,0.3},3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.1384,0.1912,0.2984},0.88};
					ambientMidCloud[] = {{0.1384,0.1912,0.2984},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0.025,0.025,0.023};
					bidirectCloud[] = {0.0245,0.0245,0.02254};
					sky[] = {0.231,0.314,0.467};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {{0.09,0.137,0.22},0.025};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{0.5,0.65,1},11.016};
					swBrightness = 1;
				};
				class Lighting14
				{
					height = 0;
					overcast = 0.6;
					sunAngle = -12;
					sunOrMoon = 0;
					diffuse[] = {0.1,0.18,0.3};
					diffuseCloud[] = {0.1,0.18,0.3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.173,0.239,0.373},0.88};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {{0.094,0.141,0.231},0.025};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting15
				{
					height = 0;
					overcast = 0.6;
					sunAngle = -11;
					sunOrMoon = 0.5;
					diffuse[] = {0.1,0.18,0.3};
					diffuseCloud[] = {0.1,0.18,0.3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.173,0.239,0.373},0.88};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {{0.094,0.141,0.231},0.025};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting16
				{
					height = 0;
					overcast = 0.6;
					sunAngle = -10;
					sunOrMoon = 1;
					diffuse[] = {0.1,0.18,0.3};
					diffuseCloud[] = {0.1,0.18,0.3};
					ambient[] = {{0.173,0.239,0.373},1};
					ambientCloud[] = {{0.173,0.239,0.373},1};
					ambientMid[] = {{0.173,0.239,0.373},0.88};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.88};
					groundReflection[] = {{0.173,0.239,0.373},0.8448};
					groundReflectionCloud[] = {{0.173,0.239,0.373},0.8448};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {{0.2,0.25,0.45},4.734908};
					fogColor[] = {{0.094,0.141,0.231},0.025};
					apertureMin = 4;
					apertureStandard = 5;
					apertureMax = 10;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting17
				{
					height = 0;
					overcast = 0.6;
					sunAngle = -5;
					sunOrMoon = 1;
					diffuse[] = {{0.16,0.18,0.28},2.25};
					diffuseCloud[] = {{0.16,0.18,0.28},1.6875};
					ambient[] = {{0.173,0.239,0.373},4.6};
					ambientCloud[] = {{0.173,0.239,0.373},4.6};
					ambientMid[] = {{0.173,0.239,0.373},4.048};
					ambientMidCloud[] = {{0.173,0.239,0.373},4.048};
					groundReflection[] = {{0.173,0.239,0.373},3.88608};
					groundReflectionCloud[] = {{0.173,0.239,0.373},3.88608};
					bidirect[] = {0.0115,0.012,0.0125};
					bidirectCloud[] = {0.01127,0.01176,0.01225};
					sky[] = {{0.2,0.298,0.541},4.6};
					skyAroundSun[] = {{0.7,0.35,0.28},7.636949};
					fogColor[] = {{0.106,0.161,0.267},4.715};
					apertureMin = 5;
					apertureStandard = 6;
					apertureMax = 18;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting18
				{
					height = 0;
					overcast = 0.6;
					sunAngle = -2;
					sunOrMoon = 1;
					diffuse[] = {{0.25,0.21,0.2},3.75};
					diffuseCloud[] = {{0.25,0.21,0.2},2.8125};
					ambient[] = {{0.196,0.275,0.42},6.9};
					ambientCloud[] = {{0.196,0.275,0.42},6.9};
					ambientMid[] = {{0.196,0.275,0.42},6.072};
					ambientMidCloud[] = {{0.196,0.275,0.42},6.072};
					groundReflection[] = {{0.196,0.275,0.42},5.82912};
					groundReflectionCloud[] = {{0.196,0.275,0.42},5.82912};
					bidirect[] = {0.023,0.024,0.025};
					bidirectCloud[] = {0.023,0.024,0.025};
					sky[] = {{0.188,0.29,0.576},6.9};
					skyAroundSun[] = {{1.8,0.42,0.2},12.31766};
					fogColor[] = {{0.11,0.169,0.286},7.0725};
					apertureMin = 6;
					apertureStandard = 8;
					apertureMax = 20;
					standardAvgLum = 20;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting19
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 0;
					sunOrMoon = 1;
					diffuse[] = {{0.75,0.38,0.22},4.5};
					diffuseCloud[] = {{0.75,0.38,0.22},3.375};
					ambient[] = {{0.2497,0.31,0.467},7.8};
					ambientCloud[] = {{0.2497,0.31,0.467},7.8};
					ambientMid[] = {{0.2541,0.314,0.467},6.864};
					ambientMidCloud[] = {{0.2541,0.314,0.467},6.864};
					groundReflection[] = {{0.235,0.318,0.467},6.58944};
					groundReflectionCloud[] = {{0.235,0.318,0.467},6.58944};
					bidirect[] = {0.023,0.024,0.025};
					bidirectCloud[] = {0.023,0.024,0.025};
					sky[] = {{0.173,0.282,0.612},7.8};
					skyAroundSun[] = {{2,0.42,0.2},13.38876};
					fogColor[] = {{0.118,0.18,0.31},7.995};
					apertureMin = 7;
					apertureStandard = 9;
					apertureMax = 22;
					standardAvgLum = 45;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting20
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 2;
					sunOrMoon = 1;
					diffuse[] = {{0.95,0.42,0.22},6.72};
					diffuseCloud[] = {{0.95,0.42,0.22},5.04};
					ambient[] = {{0.306,0.357,0.463},8.4};
					ambientCloud[] = {{0.306,0.357,0.463},8.4};
					ambientMid[] = {{0.365,0.361,0.396},7.392};
					ambientMidCloud[] = {{0.365,0.361,0.396},7.392};
					groundReflection[] = {{0.416,0.38,0.388},7.09632};
					groundReflectionCloud[] = {{0.416,0.38,0.388},7.09632};
					bidirect[] = {0.023,0.024,0.025};
					bidirectCloud[] = {0.023,0.024,0.025};
					sky[] = {{0.157,0.275,0.651},8.4};
					skyAroundSun[] = {{2.2,0.8,0.2},13.38876};
					fogColor[] = {{0.125,0.192,0.329},8.61};
					apertureMin = 8;
					apertureStandard = 10;
					apertureMax = 24;
					standardAvgLum = 50;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting21
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 6;
					sunOrMoon = 1;
					diffuse[] = {{0.95,0.55,0.35},10.2};
					diffuseCloud[] = {{0.95,0.55,0.35},7.65};
					ambient[] = {{0.337,0.404,0.525},9.6};
					ambientCloud[] = {{0.337,0.404,0.525},9.6};
					ambientMid[] = {{0.412,0.408,0.443},8.448};
					ambientMidCloud[] = {{0.412,0.408,0.443},8.448};
					groundReflection[] = {{0.475,0.435,0.431},8.11008};
					groundReflectionCloud[] = {{0.475,0.435,0.431},8.11008};
					bidirect[] = {0.01375,0.0132,0.01265};
					bidirectCloud[] = {0.01375,0.0132,0.01265};
					sky[] = {{0.145,0.263,0.686},9.6};
					skyAroundSun[] = {{0.4,0.32,0.6},13.38876};
					fogColor[] = {{0.133,0.204,0.357},9.84};
					apertureMin = 8;
					apertureStandard = 16;
					apertureMax = 26;
					standardAvgLum = 100;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.027,0.045};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting22
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 12;
					sunOrMoon = 1;
					diffuse[] = {{1,0.65,0.45},12.3};
					diffuseCloud[] = {{1,0.65,0.45},9.225};
					ambient[] = {{0.388,0.471,0.612},10.9};
					ambientCloud[] = {{0.388,0.471,0.612},10.9};
					ambientMid[] = {{0.482,0.475,0.506},9.81};
					ambientMidCloud[] = {{0.482,0.475,0.506},9.81};
					groundReflection[] = {{0.557,0.51,0.494},9.4176};
					groundReflectionCloud[] = {{0.557,0.51,0.494},9.4176};
					bidirect[] = {0.01875,0.018,0.01725};
					bidirectCloud[] = {0.01875,0.018,0.01725};
					sky[] = {{0.129,0.259,0.722},10.9};
					skyAroundSun[] = {{0.13,0.25,0.8},13.524};
					fogColor[] = {{0.145,0.224,0.396},11.1725};
					apertureMin = 20;
					apertureStandard = 25;
					apertureMax = 35;
					standardAvgLum = 250;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.018,0.04};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},12.24};
					swBrightness = 1;
				};
				class Lighting23
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 24;
					sunOrMoon = 1;
					diffuse[] = {{1,0.75,0.62},15.8};
					diffuseCloud[] = {{1,0.75,0.62},11.85};
					ambient[] = {{0.435,0.533,0.698},13.8};
					ambientCloud[] = {{0.435,0.533,0.698},13.8};
					ambientMid[] = {{0.545,0.541,0.569},12.696};
					ambientMidCloud[] = {{0.545,0.541,0.569},12.696};
					groundReflection[] = {{0.635,0.58,0.557},12.18816};
					groundReflectionCloud[] = {{0.635,0.58,0.557},12.18816};
					bidirect[] = {0.025,0.024,0.018};
					bidirectCloud[] = {0.025,0.024,0.018};
					sky[] = {{0.118,0.251,0.753},13.8};
					skyAroundSun[] = {{0.115,0.245,0.8},13.662};
					fogColor[] = {{0.15,0.251,0.488},14.145};
					apertureMin = 45;
					apertureStandard = 60;
					apertureMax = 80;
					standardAvgLum = 800;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.4};
					swBrightness = 1;
				};
				class Lighting24
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 45;
					sunOrMoon = 1;
					diffuse[] = {{1,0.87,0.85},17};
					diffuseCloud[] = {{1,0.87,0.85},12.75};
					ambient[] = {{0.498,0.602,0.77},14.8};
					ambientCloud[] = {{0.498,0.602,0.77},14.8};
					ambientMid[] = {{0.635,0.635,0.663},13.616};
					ambientMidCloud[] = {{0.635,0.635,0.663},13.616};
					groundReflection[] = {{0.745,0.671,0.643},14.21392};
					groundReflectionCloud[] = {{0.745,0.671,0.643},14.21392};
					bidirect[] = {0.025,0.024,0.018};
					bidirectCloud[] = {0.025,0.024,0.018};
					sky[] = {{0.02,0.12,0.8},13.8};
					skyAroundSun[] = {{0.02,0.12,0.8},13.8};
					fogColor[] = {{0.3,0.44,0.74},13.9564};
					apertureMin = 70;
					apertureStandard = 120;
					apertureMax = 120;
					standardAvgLum = 8000;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting25
				{
					height = 0;
					overcast = 0.6;
					sunAngle = 90;
					sunOrMoon = 1;
					diffuse[] = {{1,0.87,0.85},17};
					diffuseCloud[] = {{1,0.87,0.85},13.94};
					ambient[] = {{0.498,0.602,0.77},14.8};
					ambientCloud[] = {{0.498,0.602,0.77},14.8};
					ambientMid[] = {{0.635,0.635,0.663},14.504};
					ambientMidCloud[] = {{0.635,0.635,0.663},14.504};
					groundReflection[] = {{0.745,0.671,0.643},14.21392};
					groundReflectionCloud[] = {{0.745,0.671,0.643},14.21392};
					bidirect[] = {0.025,0.024,0.018};
					bidirectCloud[] = {0.025,0.024,0.018};
					sky[] = {{0.02,0.12,0.8},13.8};
					skyAroundSun[] = {{0.02,0.12,0.8},13.8};
					fogColor[] = {{0.3,0.44,0.74},15};
					apertureMin = 70;
					apertureStandard = 120;
					apertureMax = 120;
					standardAvgLum = 8000;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting26
				{
					height = 0;
					overcast = 0.85;
					sunAngle = -24;
					sunOrMoon = 0;
					diffuse[] = {{0.09,0.137,0.22},1};
					diffuseCloud[] = {{0,0,0},0.75};
					ambient[] = {{0.09,0.137,0.22},1};
					ambientCloud[] = {{0.09,0.137,0.22},1};
					ambientMid[] = {{0.09,0.137,0.22},0.8624};
					ambientMidCloud[] = {{0.09,0.137,0.22},0.8624};
					groundReflection[] = {{0.09,0.137,0.22},0.758912};
					groundReflectionCloud[] = {{0.09,0.137,0.22},0.758912};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {0.231,0.314,0.467};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {0.09,0.137,0.22};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting27
				{
					height = 0;
					overcast = 0.85;
					sunAngle = -12;
					sunOrMoon = 0;
					diffuse[] = {0.16954,0.239,0.37673};
					diffuseCloud[] = {0.042385,0.05975,0.094183};
					ambient[] = {{0.16954,0.239,0.37673},1};
					ambientCloud[] = {{0.16954,0.239,0.37673},1};
					ambientMid[] = {{0.173,0.239,0.373},0.8624};
					ambientMidCloud[] = {{0.173,0.239,0.373},0.8624};
					groundReflection[] = {{0.14705,0.20315,0.31705},0.758912};
					groundReflectionCloud[] = {{0.14705,0.20315,0.31705},0.758912};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {0.122,0.169,0.255};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting28
				{
					height = 0;
					overcast = 0.85;
					sunAngle = -11;
					sunOrMoon = 0.5;
					diffuse[] = {0.129,0.18,0.271};
					diffuseCloud[] = {0.03225,0.045,0.06775};
					ambient[] = {{0.129,0.18,0.271},1};
					ambientCloud[] = {{0.129,0.18,0.271},1};
					ambientMid[] = {{0.129,0.184,0.267},0.8624};
					ambientMidCloud[] = {{0.129,0.184,0.267},0.8624};
					groundReflection[] = {{0.125,0.176,0.263},0.758912};
					groundReflectionCloud[] = {{0.125,0.176,0.263},0.758912};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {0.2,0.25,0.45};
					fogColor[] = {0.122,0.169,0.255};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting29
				{
					height = 0;
					overcast = 0.85;
					sunAngle = -10;
					sunOrMoon = 1;
					diffuse[] = {0.129,0.18,0.271};
					diffuseCloud[] = {0.03225,0.045,0.06775};
					ambient[] = {{0.129,0.18,0.271},1};
					ambientCloud[] = {{0.129,0.18,0.271},1};
					ambientMid[] = {{0.129,0.184,0.267},0.8624};
					ambientMidCloud[] = {{0.129,0.184,0.267},0.8624};
					groundReflection[] = {{0.125,0.176,0.263},0.758912};
					groundReflectionCloud[] = {{0.125,0.176,0.263},0.758912};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.212,0.302,0.51},1};
					skyAroundSun[] = {{0.2,0.25,0.45},4.734908};
					fogColor[] = {0.122,0.169,0.255};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 10;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting30
				{
					height = 0;
					overcast = 0.85;
					sunAngle = -5;
					sunOrMoon = 1;
					diffuse[] = {{0.157,0.212,0.306},0.5625};
					diffuseCloud[] = {{0.03925,0.053,0.0765},0.39375};
					ambient[] = {{0.157,0.212,0.306},3.22};
					ambientCloud[] = {{0.157,0.212,0.306},3.22};
					ambientMid[] = {{0.157,0.208,0.298},3.96704};
					ambientMidCloud[] = {{0.157,0.208,0.298},3.96704};
					groundReflection[] = {{0.149,0.204,0.29},3.649677};
					groundReflectionCloud[] = {{0.149,0.204,0.29},3.649677};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.2,0.298,0.541},4.6};
					skyAroundSun[] = {{0.7,0.35,0.28},7.636949};
					fogColor[] = {{0.141,0.192,0.282},3.96704};
					apertureMin = 5;
					apertureStandard = 5;
					apertureMax = 18;
					standardAvgLum = 4;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting31
				{
					height = 0;
					overcast = 0.85;
					sunAngle = -2;
					sunOrMoon = 1;
					diffuse[] = {{0.184,0.247,0.341},0.9375};
					diffuseCloud[] = {{0.046,0.06175,0.08525},0.65625};
					ambient[] = {{0.184,0.247,0.341},6.9};
					ambientCloud[] = {{0.184,0.247,0.341},6.9};
					ambientMid[] = {{0.184,0.243,0.329},5.95056};
					ambientMidCloud[] = {{0.184,0.243,0.329},5.95056};
					groundReflection[] = {{0.176,0.231,0.322},5.593526};
					groundReflectionCloud[] = {{0.176,0.231,0.322},5.593526};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.188,0.29,0.576},6.9};
					skyAroundSun[] = {{1.8,0.42,0.2},12.31766};
					fogColor[] = {{0.165,0.22,0.31},5.95056};
					apertureMin = 6;
					apertureStandard = 6;
					apertureMax = 20;
					standardAvgLum = 20;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting32
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 0;
					sunOrMoon = 1;
					diffuse[] = {{0.216,0.286,0.384},1.125};
					diffuseCloud[] = {{0.054,0.0715,0.096},0.7875};
					ambient[] = {{0.216,0.286,0.384},7.8};
					ambientCloud[] = {{0.216,0.286,0.384},7.8};
					ambientMid[] = {{0.22,0.278,0.365},6.72672};
					ambientMidCloud[] = {{0.22,0.278,0.365},6.72672};
					groundReflection[] = {{0.204,0.267,0.353},6.457651};
					groundReflectionCloud[] = {{0.204,0.267,0.353},6.457651};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.173,0.282,0.612},7.8};
					skyAroundSun[] = {{2,0.42,0.2},13.38876};
					fogColor[] = {{0.188,0.247,0.341},6.72672};
					apertureMin = 7;
					apertureStandard = 7;
					apertureMax = 22;
					standardAvgLum = 45;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting33
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 2;
					sunOrMoon = 1;
					diffuse[] = {{0.255,0.325,0.42},1.68};
					diffuseCloud[] = {{0.06375,0.08125,0.105},1.176};
					ambient[] = {{0.255,0.325,0.42},8.4};
					ambientCloud[] = {{0.255,0.325,0.42},8.4};
					ambientMid[] = {{0.259,0.314,0.396},7.24416};
					ambientMidCloud[] = {{0.259,0.314,0.396},7.24416};
					groundReflection[] = {{0.239,0.294,0.376},7.099277};
					groundReflectionCloud[] = {{0.239,0.294,0.376},7.099277};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.157,0.275,0.651},8.4};
					skyAroundSun[] = {{2.2,0.8,0.2},13.38876};
					fogColor[] = {{0.216,0.275,0.373},7.24416};
					apertureMin = 8;
					apertureStandard = 8;
					apertureMax = 24;
					standardAvgLum = 50;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting34
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 6;
					sunOrMoon = 1;
					diffuse[] = {{0.298,0.365,0.451},2.55};
					diffuseCloud[] = {{0.0745,0.09125,0.11275},1.785};
					ambient[] = {{0.298,0.365,0.451},9.6};
					ambientCloud[] = {{0.298,0.365,0.451},9.6};
					ambientMid[] = {{0.302,0.349,0.416},8.27904};
					ambientMidCloud[] = {{0.302,0.349,0.416},8.27904};
					groundReflection[] = {{0.275,0.318,0.384},8.11346};
					groundReflectionCloud[] = {{0.275,0.318,0.384},8.11346};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.145,0.263,0.686},9.6};
					skyAroundSun[] = {{0.4,0.32,0.6},13.38876};
					fogColor[] = {{0.243,0.306,0.408},8.27904};
					apertureMin = 8;
					apertureStandard = 14;
					apertureMax = 26;
					standardAvgLum = 100;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.027,0.045};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting35
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 12;
					sunOrMoon = 1;
					diffuse[] = {{0.376,0.431,0.506},3.075};
					diffuseCloud[] = {{0.094,0.10775,0.1265},2.1525};
					ambient[] = {{0.376,0.431,0.506},10.9};
					ambientCloud[] = {{0.376,0.431,0.506},10.9};
					ambientMid[] = {{0.38,0.408,0.447},9.6138};
					ambientMidCloud[] = {{0.38,0.408,0.447},9.6138};
					groundReflection[] = {{0.329,0.361,0.396},9.421524};
					groundReflectionCloud[] = {{0.329,0.361,0.396},9.421524};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.129,0.259,0.722},10.9};
					skyAroundSun[] = {{0.13,0.25,0.8},13.524};
					fogColor[] = {{0.286,0.353,0.463},9.6138};
					apertureMin = 20;
					apertureStandard = 22;
					apertureMax = 35;
					standardAvgLum = 250;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.018,0.04};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},12.24};
					swBrightness = 1;
				};
				class Lighting36
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 24;
					sunOrMoon = 1;
					diffuse[] = {{0.447,0.494,0.557},3.95};
					diffuseCloud[] = {{0,0,0},2.765};
					ambient[] = {{0.447,0.494,0.557},13.8};
					ambientCloud[] = {{0.447,0.494,0.557},13.8};
					ambientMid[] = {{0.455,0.467,0.475},12.44208};
					ambientMidCloud[] = {{0.455,0.467,0.475},12.44208};
					groundReflection[] = {{0.388,0.396,0.408},12.19324};
					groundReflectionCloud[] = {{0.388,0.396,0.408},12.19324};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.118,0.251,0.753},13.8};
					skyAroundSun[] = {{0.115,0.245,0.8},13.662};
					fogColor[] = {{0.333,0.404,0.518},12.44208};
					apertureMin = 45;
					apertureStandard = 50;
					apertureMax = 80;
					standardAvgLum = 800;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.4};
					swBrightness = 1;
				};
				class Lighting37
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 45;
					sunOrMoon = 1;
					diffuse[] = {{0.506,0.553,0.608},4.25};
					diffuseCloud[] = {0.1265,0.13825,0.152};
					ambient[] = {{0.506,0.553,0.608},14.8};
					ambientCloud[] = {{0.506,0.553,0.608},14.8};
					ambientMid[] = {{0.514,0.518,0.514},13.34368};
					ambientMidCloud[] = {{0.514,0.518,0.514},13.34368};
					groundReflection[] = {{0.435,0.439,0.439},13.07681};
					groundReflectionCloud[] = {{0.435,0.439,0.439},13.07681};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.02,0.12,0.8},13.8};
					skyAroundSun[] = {{0.02,0.12,0.8},13.8};
					fogColor[] = {{0.369,0.447,0.565},13.34368};
					apertureMin = 70;
					apertureStandard = 100;
					apertureMax = 120;
					standardAvgLum = 8000;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting38
				{
					height = 0;
					overcast = 0.85;
					sunAngle = 90;
					sunOrMoon = 1;
					diffuse[] = {{0.549,0.596,0.651},4.25};
					diffuseCloud[] = {0.13725,0.149,0.16275};
					ambient[] = {{0.549,0.596,0.651},14.8};
					ambientCloud[] = {{0.549,0.596,0.651},14.8};
					ambientMid[] = {{0.557,0.557,0.585},14.21392};
					ambientMidCloud[] = {{0.557,0.557,0.585},14.21392};
					groundReflection[] = {{0.471,0.471,0.463},13.92964};
					groundReflectionCloud[] = {{0.471,0.471,0.463},13.92964};
					bidirect[] = {0.0117,0.0117,0.0117};
					bidirectCloud[] = {0.0117,0.0117,0.0117};
					sky[] = {{0.02,0.12,0.8},13.8};
					skyAroundSun[] = {{0.02,0.12,0.8},13.8};
					fogColor[] = {{0.4,0.48,0.6},15};
					apertureMin = 70;
					apertureStandard = 110;
					apertureMax = 120;
					standardAvgLum = 8000;
					desiredLuminanceCoef = 1;
					desiredLuminanceCoefCloud = 1;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 0.5;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting39
				{
					height = -0.1;
					overcast = 0.8;
					sunAngle = -24;
					sunOrMoon = 0;
					diffuse[] = {{0.6,0.8,1},2.8};
					diffuseCloud[] = {{0.6,0.8,1},2.8};
					ambient[] = {{0.4,0.9,1},0.84};
					ambientCloud[] = {{0.4,0.9,1},0.84};
					ambientMid[] = {{0.24,0.63,1},0.9072};
					ambientMidCloud[] = {{0.24,0.63,1},0.9072};
					groundReflection[] = {{0.24,0.63,1},0.870912};
					groundReflectionCloud[] = {{0.24,0.63,1},0.870912};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {0,0.2355,0.2335};
					skyAroundSun[] = {0,0.2355,0.2335};
					fogColor[] = {{0.09,0.137,0.22},0.0275};
					apertureMin = 4;
					apertureStandard = 4;
					apertureMax = 8;
					standardAvgLum = 4;
					desiredLuminanceCoef = 0;
					desiredLuminanceCoefCloud = 0;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 1;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting40
				{
					height = -0.1;
					overcast = 0.8;
					sunAngle = -5;
					sunOrMoon = 1;
					diffuse[] = {{0.6,0.8,1},2.1};
					diffuseCloud[] = {{0.6,0.8,1},2.1};
					ambient[] = {{0.4,0.9,1},3.68};
					ambientCloud[] = {{0.4,0.9,1},3.68};
					ambientMid[] = {{0.24,0.63,1},3.9744};
					ambientMidCloud[] = {{0.24,0.63,1},3.9744};
					groundReflection[] = {{0.24,0.63,1},3.815424};
					groundReflectionCloud[] = {{0.24,0.63,1},3.815424};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0,0.2235,0.2705},4.232};
					skyAroundSun[] = {{0,0.2235,0.2705},7.636949};
					fogColor[] = {{0.106,0.161,0.267},4.715};
					apertureMin = 5;
					apertureStandard = 6;
					apertureMax = 18;
					standardAvgLum = 4;
					desiredLuminanceCoef = 0;
					desiredLuminanceCoefCloud = 0;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 1;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting41
				{
					height = -0.1;
					overcast = 0.8;
					sunAngle = -2;
					sunOrMoon = 1;
					diffuse[] = {{0.6,0.8,1},3.5};
					diffuseCloud[] = {{0.6,0.8,1},3.5};
					ambient[] = {{0.4,0.9,1},5.52};
					ambientCloud[] = {{0.4,0.9,1},5.52};
					ambientMid[] = {{0.24,0.63,1},5.9616};
					ambientMidCloud[] = {{0.24,0.63,1},5.9616};
					groundReflection[] = {{0.24,0.63,1},5.723136};
					groundReflectionCloud[] = {{0.24,0.63,1},5.723136};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0,0.2175,0.288},6.348};
					skyAroundSun[] = {{0,0.2175,0.288},12.31766};
					fogColor[] = {{0.11,0.169,0.286},7.0725};
					apertureMin = 6;
					apertureStandard = 8;
					apertureMax = 20;
					standardAvgLum = 20;
					desiredLuminanceCoef = 0;
					desiredLuminanceCoefCloud = 0;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 1;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting42
				{
					height = -0.1;
					overcast = 0.8;
					sunAngle = 0;
					sunOrMoon = 1;
					diffuse[] = {{0.6,0.8,1},4.2};
					diffuseCloud[] = {{0.6,0.8,1},4.2};
					ambient[] = {{0.4,0.9,1},6.24};
					ambientCloud[] = {{0.4,0.9,1},6.24};
					ambientMid[] = {{0.24,0.63,1},6.7392};
					ambientMidCloud[] = {{0.24,0.63,1},6.7392};
					groundReflection[] = {{0.24,0.63,1},6.469632};
					groundReflectionCloud[] = {{0.24,0.63,1},6.469632};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0,0.2115,0.306},7.176};
					skyAroundSun[] = {{0,0.2115,0.306},13.38876};
					fogColor[] = {{0.118,0.18,0.31},7.995};
					apertureMin = 7;
					apertureStandard = 9;
					apertureMax = 22;
					standardAvgLum = 45;
					desiredLuminanceCoef = 0;
					desiredLuminanceCoefCloud = 0;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 1;
					rayleigh[] = {0.007,0.038,0.0675};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},11.016};
					swBrightness = 1;
				};
				class Lighting43
				{
					height = -0.1;
					overcast = 0.8;
					sunAngle = 45;
					sunOrMoon = 1;
					diffuse[] = {{0.6,0.8,1},12.04};
					diffuseCloud[] = {{0.6,0.8,1},12.04};
					ambient[] = {{0.4,0.9,1},11.84};
					ambientCloud[] = {{0.4,0.9,1},11.84};
					ambientMid[] = {{0.36,0.72,1},11.4848};
					ambientMidCloud[] = {{0.36,0.72,1},11.4848};
					groundReflection[] = {{0.36,0.72,1},11.02541};
					groundReflectionCloud[] = {{0.36,0.72,1},11.02541};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0,0.09,0.4},13.8};
					skyAroundSun[] = {{0,0.09,0.4},13.8};
					fogColor[] = {{0.3,0.44,0.74},16.5};
					apertureMin = 12;
					apertureStandard = 18;
					apertureMax = 25;
					standardAvgLum = 150;
					desiredLuminanceCoef = 0;
					desiredLuminanceCoefCloud = 0;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 1;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
				class Lighting44
				{
					height = -0.1;
					overcast = 0.8;
					sunAngle = 90;
					sunOrMoon = 1;
					diffuse[] = {{0.6,0.8,1},12.04};
					diffuseCloud[] = {{0.6,0.8,1},12.04};
					ambient[] = {{0.4,0.9,1},11.84};
					ambientCloud[] = {{0.4,0.9,1},11.84};
					ambientMid[] = {{0.36,0.72,1},11.4848};
					ambientMidCloud[] = {{0.36,0.72,1},11.4848};
					groundReflection[] = {{0.36,0.72,1},11.02541};
					groundReflectionCloud[] = {{0.36,0.72,1},11.02541};
					bidirect[] = {0,0,0};
					bidirectCloud[] = {0,0,0};
					sky[] = {{0,0.09,0.4},13.8};
					skyAroundSun[] = {{0,0.09,0.4},13.8};
					fogColor[] = {{0.3,0.44,0.74},16.5};
					apertureMin = 12;
					apertureStandard = 18;
					apertureMax = 25;
					standardAvgLum = 150;
					desiredLuminanceCoef = 0;
					desiredLuminanceCoefCloud = 0;
					luminanceRectCoef = 1;
					luminanceRectCoefCloud = 1;
					rayleigh[] = {0.007,0.01388,0.035};
					mie[] = {0.005,0.005,0.005};
					cloudsColor[] = {{1,1,1},14.8};
					swBrightness = 1;
				};
			};
			class Lighting: Lighting
			{
				class BrightAlmost: DayLightingBrightAlmost
				{
					overcast = 0.0;
				};
				class Rainy: DayLightingRainy
				{
					overcast = 1.0;
				};
			};
			class Overcast: Overcast
			{
				class Weather1: Weather1
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_clear_lco.paa";
				};
				class Weather7: Weather1
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_clear_lco.paa";
				};
				class Weather2: Weather2
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_almostclear_lco.paa";
				};
				class Weather3: Weather3
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_cloudy_lco.paa";
				};
				class Weather4: Weather4
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_cloudy_lco.paa";
				};
				class Weather5: Weather5
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_overcast_lco.paa";
				};
				class Weather6: Weather6
				{
					sky = "A3\Map_Stratis\Data\sky_clear_gs.paa";
					horizon = "A3\Map_Stratis\Data\sky_clear_horizont_sky.paa";
					skyR = "A3\Map_Stratis\Data\sky_overcast_lco.paa";
				};
			};
		};
		humidityUpCoef = 0.1;
		humidityDownCoef = 0.05;
		class SimulWeather
		{
			noiseTexture = "a3\data_f\noise_raw.paa";
			numKeyframesPerDay = 48;
			windSpeedCoef = "10.0f";
			moonIrradianceCoef = "10.0f";
			fadeMaxDistanceKm = 1000.0;
			fadeMaxAltitudeKm = 15.0;
			fadeNumAltitudes = 8;
			fadeNumElevations = 8;
			fadeNumDistances = 8;
			fadeEarthTest = 1;
			autoBrightness = 0;
			autoBrightnessStrength = 0.1;
			cloudGridWidth = 64;
			cloudGridLength = 64;
			cloudGridHeight = 16;
			helperGridElevationSteps = 24;
			helperGridAzimuthSteps = 15;
			helperEffectiveEarthRadius = 1000000;
			helperCurvedEarth = 1;
			helperAdjustCurvature = 0;
			helperNumLayers = 120;
			helperMaxDistance = 160000;
			helperNearCloudFade = 0.1;
			helperChurn = 10;
			cloudWidth = 40000;
			cloudLength = 40000;
			wrapClouds = 1;
			noiseResolution = 8;
			noisePeriod = 4.0;
			opticalDensity = 0.5;
			alphaSharpness = 0.85;
			selfShadowScale = 0.905;
			mieAsymmetry = 0.5087;
			minimumLightElevationDegrees = 6.0;
			directLightCoef = 1.0;
			indirectLightCoef = 0.04;
			fogStart = 0;
			fogEnd = 50000;
			fogHeight = 2000;
			class DefaultKeyframe
			{
				rayleigh[] = {0.00749,0.01388,0.02878};
				mie[] = {0.0046,0.0046,0.0046};
				haze = 30;
				hazeBaseKm = 5.0;
				hazeScaleKm = 1.0;
				hazeEccentricity = 1;
				brightnessAdjustment = 1.0;
				cloudiness = 0.6;
				cloudBaseKm = 2.85;
				cloudHeightKm = 6.0;
				directLight = 1.0;
				indirectLight = 1.0;
				ambientLight = 0.2;
				noiseOctaves = 4.3;
				noisePersistence = 0.535;
				fractalAmplitude = 2.3;
				fractalWavelength = 240.0;
				extinction = 4.7;
				diffusivity = 0.001;
			};
			class Overcast
			{
				class Weather1: DefaultKeyframe
				{
					overcast = 0.0;
					cloudiness = 0.0;
					diffusivity = 0.001;
					seqFileKeyframe = 0;
				};
				class Weather2: DefaultKeyframe
				{
					overcast = 0.2;
					cloudiness = 0.25;
					diffusivity = 0.001;
					seqFileKeyframe = 0;
				};
				class Weather3: DefaultKeyframe
				{
					overcast = 0.4;
					cloudiness = 0.45;
					diffusivity = 0.001;
					seqFileKeyframe = 3;
				};
				class Weather4: DefaultKeyframe
				{
					overcast = 0.5;
					cloudiness = 0.46;
					diffusivity = 0.01;
					seqFileKeyframe = 4;
				};
				class Weather5: DefaultKeyframe
				{
					overcast = 0.8;
					cloudiness = 0.8;
					diffusivity = 0.01;
					extinction = 4.3;
					cloudBaseKm = 1.9;
					cloudHeightKm = 8.0;
					seqFileKeyframe = 4;
				};
				class Weather6: DefaultKeyframe
				{
					overcast = 1.0;
					cloudiness = 1.0;
					diffusivity = 0.001;
					extinction = 4.0;
					cloudBaseKm = 1.7;
					cloudHeightKm = 10.0;
					seqFileKeyframe = 4;
				};
			};
		};
		hazeDistCoef = 0.1;
		hazeFogCoef = 0.98;
		hazeBaseHeight = 0;
		hazeBaseBeta0 = 8e-05;
		hazeDensityDecay = 0.00036;
		horizonParallaxCoef = 0.0;
		horizonFogColorationStart = 0.8;
		skyFogColorationStart = 0.7;
		horizonSunColorationIntensity = 0.001;
		aroundSunCoefMultiplier = 1.4;
		aroundSunCoefExponent = 12;
		soundMapSizeCoef = 4;
		satelliteNormalBlendStart = 10;
		satelliteNormalBlendEnd = 100;
		skyObject = "A3\Map_Stratis\data\obloha.p3d";
		horizontObject = "A3\Map_Stratis\data\horizont.p3d";
		skyTexture = "A3\Map_Stratis\data\sky_semicloudy_sky.paa";
		skyTextureR = "A3\Map_Stratis\data\sky_semicloudy_lco.paa";
		terrainBlendMaxDarkenCoef = 0.85;
		terrainBlendMaxBrightenCoef = 0.15;
		access = 3;
		worldId = 5;
		cutscenes[] = {"Altis_intro1"};
		description = "$STR_A3_MAP_ALTIS";
		icon = "";
		worldName = "\A3\map_Altis\Altis.wrp";
		previewVideo = "A3\Map_Altis_Scenes_F\Video\previewVideo.ogv";
		pictureMap = "A3\map_Altis\data\pictureMap_ca.paa";
		pictureShot = "A3\map_Altis\data\ui_Altis_ca.paa";
		plateFormat = "A#$-####";
		plateLetters = "ABCDEGHIKLMNOPRSTVXZ";
		author = "$STR_A3_Bohemia_Interactive";
		mapSize = 30720;
		mapZone = 35;
		mapArea[] = {25.011957,39.718452,25.481527,40.094578};
		longitude = 16.661;
		latitude = -35.152;
		elevationOffset = 0;
		minHillsAltitude = 80;
		maxHillsAltitude = 200;
		mapDrawingBrightnessModifier = 1.5;
		class EnvMaps
		{
			class EnvMap1
			{
				texture = "A3\Map_Stratis\data\env_land_ClearSky_ca.paa";
				overcast = 0;
			};
			class EnvMap2
			{
				texture = "A3\Map_Stratis\data\env_land_SemiCloudySky_ca.paa";
				overcast = 0.3;
			};
			class EnvMap3
			{
				texture = "A3\Map_Stratis\data\env_land_OvercastSky_ca.paa";
				overcast = 0.6;
			};
		};
		newRoadsShape = "\A3\Map_Altis\data\roads\roads.shp";
		class OutsideTerrain
		{
			satellite = "A3\map_Altis\data\s_satout_co.paa";
			enableTerrainSynth = 0;
			class Layers
			{
				class Layer0
				{
					nopx = "A3\Map_Data\gdt_seabed_nopx.paa";
					texture = "A3\Map_Data\gdt_seabed_co.paa";
				};
			};
			colorOutside[] = {0.227451,0.27451,0.384314,1};
		};
		class Grid: Grid
		{
			offsetX = 0;
			offsetY = 30720;
			class Zoom1
			{
				zoomMax = 0.05;
				format = "XY";
				formatX = "000";
				formatY = "000";
				stepX = 100;
				stepY = -100;
			};
			class Zoom2
			{
				zoomMax = 0.5;
				format = "XY";
				formatX = "00";
				formatY = "00";
				stepX = 1000;
				stepY = -1000;
			};
			class Zoom3
			{
				zoomMax = 1e+30;
				format = "XY";
				formatX = "0";
				formatY = "0";
				stepX = 10000;
				stepY = -10000;
			};
		};
		startTime = "12:00";
		startDate = "24/6/2035";
		centerPosition[] = {10801.9,10589.6,100};
		seagullPos[] = {15360,150.0,15360};
		ilsPosition[] = {14382.4,15924.6};
		ilsDirection[] = {-0.6947,0.052336,-0.7193};
		ilsTaxiOff[] = {14611.5,16161.2,15186.9,16747.6,15189.6,16769.4,15185.2,16794.8,15168.7,16829.6,15148,16841.7,15124.7,16835.2,14513.5,16207.6};
		ilsTaxiIn[] = {14513.5,16207.6,14212,15898.5,14204.6,15877.1,14217.1,15860.3,14255.8,15838,14283.8,15834.9,14307.4,15845,14359.5,15900};
		class SecondaryAirports
		{
			class Airstrip_1
			{
				ilsPosition[] = {11358.5,11441.2};
				ilsDirection[] = {-0.5505,0.06105,-0.8349};
				ilsTaxiOff[] = {11487.6,11646.2,11663,11913.4,11680.1,11920.8,11699.7,11917.5,11717,11906,11721.9,11893.1,11721.1,11880.1,11703.3,11856.5};
				ilsTaxiIn[] = {11703.3,11856.5,11671.8,11788,11466,11467.2,11446.5,11458.5,11427.9,11465.3,11400.7,11482.1,11398,11493,11400.4,11505};
				drawTaxiway = 0;
			};
			class Airstrip_2
			{
				ilsPosition[] = {9268.16,21575.1};
				ilsDirection[] = {0.8027,0.07,0.5964};
				ilsTaxiOff[] = {9151.03,21486,9034.07,21396.7,9022.12,21398.9,9012.96,21410.5,9008.71,21433.9,9017.87,21463.7,9126.84,21580.2,9168.44,21610.6};
				ilsTaxiIn[] = {9168.44,21610.6,9191.79,21623,9217.38,21624.5,9241.31,21612.9,9255.23,21597.2,9256.18,21568.7,9228.63,21545.7};
				drawTaxiway = 0;
			};
			class Airstrip_3
			{
				ilsPosition[] = {21075.5,7098.75};
				ilsDirection[] = {-0.1908,0.078,-0.9816};
				ilsTaxiOff[] = {21108.4,7263.5,21175.5,7590.15,21165.4,7556.14,21118.9,7518.44,20863.7,7300.61,20825.6,7275.69};
				ilsTaxiIn[] = {20825.6,7275.69,20801.9,7260.94,20798.5,7251.93,20802.7,7244.72,20815.7,7245.37,20847.4,7275.87,20862.2,7280.76,20879.3,7278.83,20902.9,7263.29,21025.1,7184.81,21062.2,7162,21076.1,7157.16,21089.4,7164.31,21093.2,7181.72};
				drawTaxiway = 0;
			};
			class Airstrip_4
			{
				ilsPosition[] = {27162.3,24910.7};
				ilsDirection[] = {0.6546,0.08,0.756};
				ilsTaxiOff[] = {27025.3,24756.3,26849.6,24558,26832.5,24542.9,26812.7,24539.7,26789.9,24547.8,26772.8,24560.6,26765.3,24581.2,26769.4,24604,26801.7,24637.3};
				ilsTaxiIn[] = {26801.7,24637.3,26831.5,24668.2,26897.3,24705.8,27097.2,24917.6,27113.2,24922.5,27131.3,24916,27142.7,24908.1,27143.8,24899.2,27140,24889.9,27132.9,24881.3};
				drawTaxiway = 0;
			};
			class Airstrip_5
			{
				ilsPosition[] = {23149.6,18400};
				ilsDirection[] = {0,0.052336,-1};
				ilsTaxiOff[] = {23144.1,18656.9,23149.8,18795.7,23148.9,18899.7,23137.2,18937.9,23100.4,18946.5,23063.1,18930.5,23046.1,18896.7,23031.6,18845.3};
				ilsTaxiIn[] = {23031.6,18845.3,23052,18396.4,23074.4,18367.8,23099.7,18356.6,23132.8,18364.5,23149,18398.5,23149.4,18432.5};
				drawTaxiway = 0;
			};
		};
		class ReplaceObjects{};
		class Sounds
		{
			sounds[] = {};
		};
		class Animation
		{
			vehicles[] = {};
		};
		clutterGrid = 1.2;
		clutterDist = 90;
		noDetailDist = 65;
		fullDetailDist = 10;
		midDetailTexture = "A3\Map_Data\middle_mco.paa";
		minTreesInForestSquare = 3;
		minRocksInRockSquare = 3;
		minObjInTownSquare = 1.4;
		class Subdivision
		{
			class Fractal
			{
				rougness = 5;
				maxRoad = 0.02;
				maxTrack = 0.5;
				maxSlopeFactor = 0.05;
			};
			class WhiteNoise
			{
				rougness = 2;
				maxRoad = 0.01;
				maxTrack = 0.05;
				maxSlopeFactor = 0.0025;
			};
			minY = -0.0;
			minSlope = 0.02;
		};
		class Ambient{};
		class AmbientA3
		{
			maxCost = 500;
			class Radius440_500
			{
				areaSpawnRadius = 70.0;
				areaMaxRadius = 200.0;
				spawnCircleRadius = 30.0;
				spawnInterval = 4.7;
				class Species
				{
					class Kestrel_random_F
					{
						maxCircleCount = "((1 - night) * 2 * (1 - (WaterDepth interpolate [1,30,0,1])) + (2 * (hills))) * (1 - night) * (1-rain)";
						maxWorldCount = 5;
						cost = 3;
						spawnCount = 1;
						groupSpawnRadius = 10;
						maxAlt = 200;
						minAlt = -10;
					};
					class Seagull
					{
						maxCircleCount = "((sea * (1 - night)) + (2 * houses * sea)) * (1 - night)";
						maxWorldCount = 40;
						cost = 3;
						spawnCount = 1;
						groupSpawnRadius = 10;
						maxAlt = 200;
						minAlt = -10;
					};
					class Rabbit_F
					{
						maxCircleCount = "(20 * (0.1 - houses)) * (1 - sea) * (1-rain)";
						maxWorldCount = 5;
						cost = 5;
						spawnCount = 1;
						groupSpawnRadius = 10;
						maxAlt = 80;
						minAlt = -5;
					};
				};
			};
			class Radius40_60
			{
				areaSpawnRadius = 50.0;
				areaMaxRadius = 83.0;
				spawnCircleRadius = 10.0;
				spawnInterval = 1.5;
				class Species
				{
					class CatShark_F
					{
						maxCircleCount = "(4 * (WaterDepth interpolate [1,30,0,1]))";
						maxWorldCount = 10;
						cost = 6;
						spawnCount = 1;
						groupSpawnRadius = 10;
						maxAlt = 10;
						minAlt = -80;
					};
					class Turtle_F
					{
						maxCircleCount = "(2 * (waterDepth interpolate [1,16,0,1]) * ((1-houses) * (1-houses)))";
						maxWorldCount = 6;
						cost = 5;
						spawnCount = 1;
						groupSpawnRadius = 10;
						maxAlt = 10;
						minAlt = -80;
					};
					class Snake_random_F
					{
						maxCircleCount = "(1 - houses) * ((2 * (1 - sea)) + (2 * (meadow)))";
						maxWorldCount = 3;
						cost = 5;
						spawnCount = 1;
						groupSpawnRadius = 5;
						maxAlt = 40;
						minAlt = -5;
					};
					class Salema_F
					{
						maxCircleCount = "(12 * ((WaterDepth interpolate [1,30,0,1]) + 0.07))";
						maxWorldCount = 40;
						cost = 5;
						spawnCount = 2;
						groupSpawnRadius = 5;
						maxAlt = 10;
						minAlt = -80;
					};
					class Ornate_random_F
					{
						maxCircleCount = "(12 * ((WaterDepth interpolate [1,30,0,1]) + 0.05))";
						maxWorldCount = 30;
						cost = 5;
						spawnCount = 3;
						groupSpawnRadius = 5;
						maxAlt = 10;
						minAlt = -80;
					};
					class Mackerel_F
					{
						maxCircleCount = "(8 * ((WaterDepth interpolate [1,30,0,1]) + 0.07))";
						maxWorldCount = 14;
						cost = 5;
						spawnCount = 2;
						groupSpawnRadius = 5;
						maxAlt = 10;
						minAlt = -80;
					};
					class Mullet_F
					{
						maxCircleCount = "(8 * ((WaterDepth interpolate [1,30,0,1]) + 0.07))";
						maxWorldCount = 14;
						cost = 5;
						spawnCount = 2;
						groupSpawnRadius = 5;
						maxAlt = 10;
						minAlt = -80;
					};
					class Tuna_F
					{
						maxCircleCount = "(8 * ((WaterDepth interpolate [1,30,0,1]) - 0.2))";
						maxWorldCount = 10;
						cost = 5;
						spawnCount = 2;
						groupSpawnRadius = 5;
						maxAlt = 10;
						minAlt = -80;
					};
				};
			};
			class Radius30_40
			{
				areaSpawnRadius = 30.0;
				areaMaxRadius = 40.0;
				spawnCircleRadius = 3.0;
				spawnInterval = 3.75;
				class Species
				{
					class DragonFly
					{
						maxCircleCount = "4 * (1 - night) * (1 - (WaterDepth interpolate [1,30,0,1])) * sea * (1 - windy) * (1-rain)";
						maxWorldCount = 4;
						cost = 1;
						spawnCount = 1;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
					class ButterFly_random
					{
						maxCircleCount = "3 * (1 - night) * (1 - (WaterDepth interpolate [1,30,0,1])) * (1 - windy) * (1-rain)";
						maxWorldCount = 6;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
					class Cicada
					{
						maxCircleCount = "(4 * night) * (1 - sea) * (1 - windy) * (1-rain)";
						maxWorldCount = 6;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 3;
						maxAlt = 30;
						minAlt = -5;
					};
				};
			};
			class Radius15_20
			{
				areaSpawnRadius = 15.0;
				areaMaxRadius = 20.0;
				spawnCircleRadius = 2.0;
				spawnInterval = 2.85;
				class Species
				{
					class FxWindGrass1
					{
						maxCircleCount = "2 * (1 - (WaterDepth interpolate [1,30,0,1])) * (windy interpolate [0.1,0.25,0,1])";
						maxWorldCount = 3;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 2.5;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindGrass2
					{
						maxCircleCount = "2 * (1 - (WaterDepth interpolate [1,30,0,1])) * (windy interpolate [0.1,0.25,0,1])";
						maxWorldCount = 3;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 2.5;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindLeaf1
					{
						maxCircleCount = "2 * (trees + 0.5) * (windy interpolate [0.1,0.25,0,1])";
						maxWorldCount = 3;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 2.5;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindLeaf2
					{
						maxCircleCount = "2 * (trees + 0.5) * (windy interpolate [0.1,0.25,0,1])";
						maxWorldCount = 3;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 2.5;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindLeaf3
					{
						maxCircleCount = "2 * (trees + 0.5) * (windy interpolate [0.1,0.25,0,1])";
						maxWorldCount = 3;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 2.5;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindPollen1
					{
						maxCircleCount = "(3 * (1 - (WaterDepth interpolate [1,30,0,1]))) * (windy interpolate [0.05,0.15,0,1])";
						maxWorldCount = 6;
						cost = 1;
						spawnCount = 1;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindPaper1
					{
						maxCircleCount = "(4 * (1 - (WaterDepth interpolate [1,30,0,1])) * houses) * windy";
						maxWorldCount = 2;
						cost = 1;
						spawnCount = 1;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
					class FxWindPlastic1
					{
						maxCircleCount = "(4 * (1 - (WaterDepth interpolate [1,30,0,1])) * houses) * windy";
						maxWorldCount = 2;
						cost = 1;
						spawnCount = 1;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
				};
			};
			class Radius6_10
			{
				areaSpawnRadius = 6.0;
				areaMaxRadius = 10.0;
				spawnCircleRadius = 1.0;
				spawnInterval = 0.1;
				class Species
				{
					class HoneyBee
					{
						maxCircleCount = "4 * (1 - night) * (1 - sea) * (1 - houses) * (1 - windy) * (1-rain)";
						maxWorldCount = 8;
						cost = 1;
						spawnCount = 1;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
					class HouseFly
					{
						maxCircleCount = "(3 + 3 * (houses)) * (1 - night) * (1 - (WaterDepth interpolate [1,30,0,1])) * (1 - windy) * (1-rain)";
						maxWorldCount = 10;
						cost = 1;
						spawnCount = 3;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
					class Mosquito
					{
						maxCircleCount = "3 * (1 - (WaterDepth interpolate [1,30,0,1])) * (1 - windy) * (1-rain)";
						maxWorldCount = 2;
						cost = 1;
						spawnCount = 1;
						groupSpawnRadius = 1;
						maxAlt = 30;
						minAlt = -5;
					};
				};
			};
		};
		class Names
		{
			class CityC_Kavala
			{
				name = "";
				position[] = {3620.39,13092.82};
				type = "CityCenter";
				demography = "CIV";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Aggelochori
			{
				name = "$STR_A3_Aggelochori0";
				position[] = {3687.78,13776.09};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Neri
			{
				name = "$STR_A3_Neri0";
				position[] = {4116.11,11736.1};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 170.0;
				angle = 0.0;
			};
			class Panochori
			{
				name = "$STR_A3_Panochori0";
				position[] = {5033.31,11245.22};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Zaros
			{
				name = "$STR_A3_Zaros0";
				position[] = {9091.81,11961.87};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Therisa
			{
				name = "$STR_A3_Therisa0";
				position[] = {10618.88,12237.26};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Katalaki
			{
				name = "$STR_A3_Katalaki0";
				position[] = {11701.06,13672.14};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 450.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Neochori
			{
				name = "$STR_A3_Neochori0";
				position[] = {12501.97,14337.03};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Stavros
			{
				name = "$STR_A3_Stavros0";
				position[] = {12950.06,15041.63};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Lakka
			{
				name = "$STR_A3_Lakka0";
				position[] = {12281.97,15732.27};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Alikampos
			{
				name = "$STR_A3_Alikampos0";
				position[] = {11112.63,14573.65};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 450.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class AgiosDionysios
			{
				name = "$STR_A3_AgiosDionysios0";
				position[] = {9187.95,15947.84};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Kore
			{
				name = "$STR_A3_Kore0";
				position[] = {7062.42,16472.12};
				type = "NameCity";
				demography = "CIV";
				radiusA = 371.91;
				radiusB = 447.25;
				angle = 0.0;
			};
			class Negades
			{
				name = "$STR_A3_Negades0";
				position[] = {4885.98,16171.33};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class AgiosKonstantinos
			{
				name = "$STR_A3_AgiosKonstantinos0";
				position[] = {3948.77,17277.85};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Topolia
			{
				name = "$STR_A3_Topolia0";
				position[] = {7375.81,15429.51};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Gravia
			{
				name = "$STR_A3_Gravia0";
				position[] = {14479.81,17614.3};
				type = "NameCity";
				demography = "CIV";
				radiusA = 734.49;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Athira
			{
				name = "$STR_A3_Athira0";
				position[] = {13993.0,18709.38};
				type = "NameCityCapital";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 306.88;
				angle = 0.0;
			};
			class Frini
			{
				name = "$STR_A3_Frini0";
				position[] = {14612.45,20786.71};
				type = "NameCity";
				demography = "CIV";
				radiusA = 270.58;
				radiusB = 325.38;
				angle = 0.0;
			};
			class Ifestiona
			{
				name = "$STR_A3_Ifestiona0";
				position[] = {12786.98,19679.31};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 176.64;
				angle = 0.0;
			};
			class Syrta
			{
				name = "$STR_A3_Syrta0";
				position[] = {8625.13,18301.56};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Galati
			{
				name = "$STR_A3_Galati0";
				position[] = {10270.28,19036.01};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 629.96;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Koroni
			{
				name = "$STR_A3_Koroni0";
				position[] = {11786.73,18372.39};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 329.01;
				angle = 0.0;
			};
			class Abdera
			{
				name = "$STR_A3_Abdera0";
				position[] = {9425.42,20284.03};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 453.27;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Telos
			{
				name = "$STR_A3_Telos0";
				position[] = {16207.02,17296.71};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Anthrakia
			{
				name = "$STR_A3_Anthrakia0";
				position[] = {16584.26,16103.96};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Kalithea
			{
				name = "$STR_A3_Kalithea0";
				position[] = {17826.51,18129.37};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 300.0;
				radiusB = 120.0;
				angle = 0.0;
			};
			class AgiosPetros
			{
				name = "$STR_A3_AgiosPetros0";
				position[] = {19339.42,17641.62};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Paros
			{
				name = "$STR_A3_Paros0";
				position[] = {20885.39,16958.76};
				type = "NameCity";
				demography = "CIV";
				radiusA = 450.0;
				radiusB = 180.0;
				angle = 0.0;
			};
			class Kalochori
			{
				name = "$STR_A3_Kalochori0";
				position[] = {21351.58,16361.88};
				type = "NameCity";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Sofia
			{
				name = "$STR_A3_Sofia0";
				position[] = {25680.53,21365.08};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Molos
			{
				name = "$STR_A3_Molos0";
				position[] = {26943.86,23170.68};
				type = "NameCity";
				demography = "CIV";
				radiusA = 350.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Ioannina
			{
				name = "$STR_A3_Ioannina0";
				position[] = {23199.68,19986.6};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 350.0;
				radiusB = 120.0;
				angle = 0.0;
			};
			class Delfinaki
			{
				name = "$STR_A3_Delfinaki0";
				position[] = {23908.6,20144.73};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 350.0;
				radiusB = 140.0;
				angle = 0.0;
			};
			class Nifi
			{
				name = "$STR_A3_Nifi0";
				position[] = {19473.33,15453.65};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Charkia
			{
				name = "$STR_A3_Charkia0";
				position[] = {18049.08,15264.07};
				type = "NameCity";
				demography = "CIV";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Dorida
			{
				name = "$STR_A3_Dorida0";
				position[] = {19336.87,13252.28};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Chalkeia
			{
				name = "$STR_A3_Chalkeia0";
				position[] = {20194.64,11660.69};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Panagia
			{
				name = "$STR_A3_Panagia0";
				position[] = {20490.18,8907.12};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 300.0;
				radiusB = 110.0;
				angle = 0.0;
			};
			class Feres
			{
				name = "$STR_A3_Feres0";
				position[] = {21640.72,7583.93};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Selakano
			{
				name = "$STR_A3_Selakano0";
				position[] = {20769.78,6736.46};
				type = "NameVillage";
				demography = "CIV";
				radiusA = 350.0;
				radiusB = 120.0;
				angle = 0.0;
			};
			class Pyrgos
			{
				name = "$STR_A3_Pyrgos0";
				position[] = {16780.61,12604.47};
				type = "NameCityCapital";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class CityC_Neri
			{
				name = "";
				position[] = {4183.13,11743.95};
				type = "CityCenter";
				demography = "CIV";
				radiusA = 100.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class CityC_AgiosDionysios
			{
				name = "";
				position[] = {9287.66,15858.07};
				type = "CityCenter";
				demography = "CIV";
				radiusA = 235.06;
				radiusB = 264.05;
				angle = 0.0;
			};
			class CityC_Katalakes
			{
				name = "";
				position[] = {9459.62,20281.93};
				type = "CityCenter";
				demography = "CIV";
				radiusA = 213.45;
				radiusB = 239.78;
				angle = 0.0;
			};
			class Kavala
			{
				name = "$STR_A3_Kavala0";
				position[] = {3458.95,12966.37};
				type = "NameCityCapital";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Poliakko
			{
				name = "$STR_A3_Poliakko0";
				position[] = {10966.47,13435.28};
				type = "NameCity";
				demography = "CIV";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Bomos
			{
				name = "$STR_A3_Bomos0";
				position[] = {2307.31,22165.18};
				type = "NameLocal";
				radiusA = 600.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Oreokastro
			{
				name = "$STR_A3_Oreokastro0";
				position[] = {4560.45,21460.64};
				type = "NameVillage";
				radiusA = 800.0;
				radiusB = 300.0;
				angle = 0.0;
			};
			class castle
			{
				name = "$STR_A3_castle0";
				position[] = {4802.99,21855.49};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 300.0;
				angle = 0.0;
			};
			class Thronos
			{
				name = "$STR_A3_Thronos0";
				position[] = {4919.32,21951.74};
				type = "Hill";
				radiusA = 346.59;
				radiusB = 263.04;
				angle = 0.0;
			};
			class Faros
			{
				name = "$STR_A3_Faros0";
				position[] = {6565.3,22639.11};
				type = "NameLocal";
				radiusA = 433.24;
				radiusB = 328.8;
				angle = 0.0;
			};
			class dump
			{
				name = "$STR_A3_dump0";
				position[] = {5887.13,20236.48};
				type = "NameLocal";
				radiusA = 277.27;
				radiusB = 210.43;
				angle = 0.0;
			};
			class Synneforos
			{
				name = "$STR_A3_Synneforos0";
				position[] = {6513.79,21604.7};
				type = "Hill";
				radiusA = 600.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Aristi
			{
				name = "$STR_A3_Aristi0";
				position[] = {7914.05,21305.19};
				type = "NameLocal";
				radiusA = 277.27;
				radiusB = 210.43;
				angle = 0.0;
			};
			class Fotia
			{
				name = "$STR_A3_Fotia0";
				position[] = {2993.48,18517.36};
				type = "NameLocal";
				radiusA = 260.96;
				radiusB = 198.05;
				angle = 0.0;
			};
			class hill01
			{
				name = "";
				position[] = {4162.73,19455.53};
				type = "Hill";
				radiusA = 350.0;
				radiusB = 350.0;
				angle = 0.0;
			};
			class Hill02
			{
				name = "$STR_A3_Hill020";
				position[] = {4808.18,17694.35};
				type = "Hill";
				radiusA = 500.0;
				radiusB = 300.0;
				angle = 0.0;
			};
			class Gori
			{
				name = "$STR_A3_Gori0";
				position[] = {5455.72,17553.66};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class AgiosMinas
			{
				name = "$STR_A3_AgiosMinas0";
				position[] = {7846.96,18005.44};
				type = "Hill";
				radiusA = 600.0;
				radiusB = 300.0;
				angle = 0.0;
			};
			class Pyrsos
			{
				name = "$STR_A3_Pyrsos0";
				position[] = {9127.1,19271.65};
				type = "Hill";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class hill03
			{
				name = "";
				position[] = {10748.89,20401.0};
				type = "Hill";
				radiusA = 250.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class KryaNera
			{
				name = "$STR_A3_KryaNera0";
				position[] = {9681.58,22294.49};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class hill04
			{
				name = "";
				position[] = {14574.43,21994.8};
				type = "Hill";
				radiusA = 250.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class CapAgrios
			{
				name = "$STR_A3_CapAgrios0";
				position[] = {14688.23,23496.23};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Nychi
			{
				name = "$STR_A3_Nychi0";
				position[] = {16837.42,21889.99};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class factory01
			{
				name = "$STR_A3_factory040";
				position[] = {14294.59,18928.49};
				type = "NameLocal";
				radiusA = 250.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class AgiaTriada
			{
				name = "$STR_A3_AgiaTriada0";
				position[] = {16668.5,20487.03};
				type = "NameVillage";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Orino
			{
				name = "$STR_A3_Orino0";
				position[] = {10410.36,17243.12};
				type = "NameVillage";
				radiusA = 450.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class military01
			{
				name = "$STR_A3_military010";
				position[] = {12771.58,16694.29};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class factory02
			{
				name = "$STR_A3_factory040";
				position[] = {12577.36,16352.75};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class airbase01
			{
				name = "$STR_A3_airbase010";
				position[] = {14037.58,16143.33};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class terminal01
			{
				name = "$STR_A3_terminal010";
				position[] = {14522.41,16833.95};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class military02
			{
				name = "$STR_A3_military010";
				position[] = {15137.16,17297.8};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class military03
			{
				name = "$STR_A3_military010";
				position[] = {16030.42,17004.84};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class PowerPlant01
			{
				name = "$STR_A3_PowerPlant020";
				position[] = {15420.83,16223.64};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Amfissa
			{
				name = "$STR_A3_Amfissa0";
				position[] = {8088.81,17257.66};
				type = "NameLocal";
				radiusA = 200.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Amoni
			{
				name = "$STR_A3_Amoni0";
				position[] = {7859.98,16673.56};
				type = "Hill";
				radiusA = 300.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class factory03
			{
				name = "$STR_A3_factory040";
				position[] = {6109.49,16246.18};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Stadium
			{
				name = "$STR_A3_Stadium0";
				position[] = {5429.69,14996.68};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class factory04
			{
				name = "$STR_A3_factory040";
				position[] = {5307.12,14500.11};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class hill05
			{
				name = "$STR_A3_hill050";
				position[] = {9187.74,11502.53};
				type = "Hill";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class XirolimniDam
			{
				name = "$STR_A3_XirolimniDam0";
				position[] = {9115.22,13959.85};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class AgiaStemma
			{
				name = "$STR_A3_AgiaStemma0";
				position[] = {7883.58,14626.41};
				type = "Hill";
				radiusA = 509.68;
				radiusB = 386.82;
				angle = 0.0;
			};
			class AACairfield
			{
				name = "$STR_A3_AACairfield0";
				position[] = {11461.19,11661.67};
				type = "NameLocal";
				radiusA = 350.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Drimea
			{
				name = "$STR_A3_Drimea0";
				position[] = {10781.89,10881.59};
				type = "NameLocal";
				radiusA = 450.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Kastro
			{
				name = "$STR_A3_Kastro0";
				position[] = {3041.4,13162.75};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class KavalaPier
			{
				name = "$STR_A3_KavalaPier0";
				position[] = {3014.83,12587.34};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class PowerPlant02
			{
				name = "$STR_A3_PowerPlant020";
				position[] = {4163.6,15047.23};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Magos
			{
				name = "$STR_A3_Magos0";
				position[] = {4564.72,15393.25};
				type = "Hill";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class quarry01
			{
				name = "$STR_A3_quarry020";
				position[] = {4379.15,12594.37};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class SavriIsland
			{
				name = "$STR_A3_SavriIsland0";
				position[] = {2370.95,11507.01};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class CapDrakontas
			{
				name = "$STR_A3_CapDrakontas0";
				position[] = {2657.32,11461.45};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class FournosIsland
			{
				name = "$STR_A3_FournosIsland0";
				position[] = {2313.67,9289.31};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Athanos
			{
				name = "$STR_A3_Athanos0";
				position[] = {3571.22,10243.74};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Edoris
			{
				name = "$STR_A3_Edoris0";
				position[] = {6002.75,10511.37};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class hill06
			{
				name = "";
				position[] = {4188.99,10754.86};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class hill07
			{
				name = "";
				position[] = {5320.31,10316.03};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Tafos
			{
				name = "$STR_A3_Tafos0";
				position[] = {5588.86,11749.69};
				type = "Hill";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class hill08
			{
				name = "";
				position[] = {6405.69,12365.63};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class AgiosPanagiotis
			{
				name = "$STR_A3_AgiosPanagiotis0";
				position[] = {6272.75,12173.9};
				type = "NameLocal";
				radiusA = 450.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class dump02
			{
				name = "$STR_A3_dump0";
				position[] = {5900.47,12454.43};
				type = "NameLocal";
				radiusA = 200.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Kavirida
			{
				name = "$STR_A3_Kavirida0";
				position[] = {7324.24,12125.41};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Edessa
			{
				name = "$STR_A3_Edessa0";
				position[] = {7194.23,11043.95};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 130.0;
				angle = 0.0;
			};
			class hill09
			{
				name = "";
				position[] = {7048.1,14070.4};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class AtsalisIsland
			{
				name = "$STR_A3_AtsalisIsland0";
				position[] = {8304.83,25081.22};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Vikos
			{
				name = "$STR_A3_Vikos0";
				position[] = {11556.89,9417.06};
				type = "NameLocal";
				radiusA = 250.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Agela
			{
				name = "$STR_A3_Agela0";
				position[] = {9186.34,8388.44};
				type = "Hill";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class hill10
			{
				name = "";
				position[] = {10729.75,7615.71};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Skopos
			{
				name = "$STR_A3_Skopos0";
				position[] = {11668.95,7579.91};
				type = "Hill";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class CapMakrinos
			{
				name = "$STR_A3_CapMakrinos0";
				position[] = {14225.87,6237.99};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class PyrgiIsland
			{
				name = "$STR_A3_PyrgiIsland0";
				position[] = {14489.94,5871.7};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Eginio
			{
				name = "$STR_A3_Eginio0";
				position[] = {11549.17,7088.39};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Sfaka
			{
				name = "$STR_A3_Sfaka0";
				position[] = {9213.95,8079.03};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class AgiosKosmas
			{
				name = "$STR_A3_AgiosKosmas0";
				position[] = {8555.32,7335.51};
				type = "NameLocal";
				radiusA = 260.96;
				radiusB = 100.0;
				angle = 0.0;
			};
			class MonisiIsland
			{
				name = "$STR_A3_MonisiIsland0";
				position[] = {7813.36,7641.19};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class MakrynisiIsland
			{
				name = "$STR_A3_MakrynisiIsland0";
				position[] = {13471.94,12018.51};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class SagonisiIsland
			{
				name = "$STR_A3_SagonisiIsland0";
				position[] = {14281.17,13469.27};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class ChelonisiIsland
			{
				name = "$STR_A3_ChelonisiIsland0";
				position[] = {16636.54,13582.2};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Faronaki
			{
				name = "$STR_A3_Faronaki0";
				position[] = {14934.42,11079.48};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Ekali
			{
				name = "$STR_A3_Ekali0";
				position[] = {17059.71,9992.32};
				type = "NameVillage";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class hill11
			{
				name = "";
				position[] = {16535.98,10787.18};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Didymos
			{
				name = "$STR_A3_Didymos0";
				position[] = {17768.88,9914.41};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class hill12
			{
				name = "";
				position[] = {18832.08,10222.03};
				type = "Hill";
				radiusA = 200.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Aktinarki
			{
				name = "$STR_A3_Aktinarki0";
				position[] = {21449.94,10873.76};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Trachia
			{
				name = "$STR_A3_Trachia0";
				position[] = {22128.14,8453.98};
				type = "NameLocal";
				radiusA = 200.0;
				radiusB = 80.0;
				angle = 0.0;
			};
			class AgiaPelagia
			{
				name = "$STR_A3_AgiaPelagia0";
				position[] = {22707.59,6930.57};
				type = "NameLocal";
				radiusA = 350.0;
				radiusB = 120.0;
				angle = 0.0;
			};
			class Mazi
			{
				name = "$STR_A3_Mazi0";
				position[] = {21772.43,6014.53};
				type = "NameLocal";
				radiusA = 150.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Livadi
			{
				name = "$STR_A3_Livadi0";
				position[] = {18410.51,8098.3};
				type = "NameLocal";
				radiusA = 150.0;
				radiusB = 60.0;
				angle = 0.0;
			};
			class CapKategidis
			{
				name = "$STR_A3_CapKategidis0";
				position[] = {22792.0,13638.38};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class SufrClub
			{
				name = "$STR_A3_SufrClub0";
				position[] = {21339.37,10434.01};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Limni
			{
				name = "$STR_A3_Limni0";
				position[] = {20920.79,14775.38};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Ochrolimni
			{
				name = "$STR_A3_Ochrolimni0";
				position[] = {23650.08,16227.26};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class CapThelos
			{
				name = "$STR_A3_CapThelos0";
				position[] = {24067.6,15560.25};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Zeloran
			{
				name = "$STR_A3_Zeloran0";
				position[] = {17043.46,19592.15};
				type = "NameLocal";
				radiusA = 150.0;
				radiusB = 60.0;
				angle = 0.0;
			};
			class quarry02
			{
				name = "$STR_A3_quarry020";
				position[] = {17060.54,11339.1};
				type = "NameLocal";
				radiusA = 260.96;
				radiusB = 198.05;
				angle = 0.0;
			};
			class storage01
			{
				name = "$STR_A3_storage010";
				position[] = {18260.61,15551.22};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class quarry03
			{
				name = "$STR_A3_quarry020";
				position[] = {19566.39,15617.26};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 120.0;
				angle = 0.0;
			};
			class Rodopoli
			{
				name = "$STR_A3_Rodopoli0";
				position[] = {18753.41,16597.12};
				type = "NameCity";
				radiusA = 500.0;
				radiusB = 300.0;
				angle = 0.0;
			};
			class CapZefyris
			{
				name = "$STR_A3_CapZefyris0";
				position[] = {18049.34,19186.59};
				type = "NameLocal";
				radiusA = 450.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class AgiosGeorgios
			{
				name = "$STR_A3_AgiosGeorgios0";
				position[] = {20296.27,18635.09};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Almyra
			{
				name = "$STR_A3_Almyra0";
				position[] = {23495.56,18392.6};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 250.0;
				angle = 0.0;
			};
			class Iraklia
			{
				name = "$STR_A3_Iraklia0";
				position[] = {21628.32,21274.94};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class military04
			{
				name = "$STR_A3_military010";
				position[] = {23533.16,21107.99};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 120.0;
				angle = 0.0;
			};
			class Nidasos
			{
				name = "$STR_A3_Nidasos0";
				position[] = {23662.9,21796.08};
				type = "NameLocal";
				radiusA = 300.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class military05
			{
				name = "$STR_A3_military010";
				position[] = {25350.64,21790.86};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Skiptro
			{
				name = "$STR_A3_Skiptro0";
				position[] = {24833.86,21802.1};
				type = "Hill";
				radiusA = 250.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class PowerPlant03
			{
				name = "$STR_A3_PowerPlant020";
				position[] = {25462.63,20357.66};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class Gatolia
			{
				name = "$STR_A3_Gatolia0";
				position[] = {26723.01,21230.33};
				type = "NameLocal";
				radiusA = 220.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Polemistia
			{
				name = "$STR_A3_Polemistia0";
				position[] = {27998.57,23775.75};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class MolosAirfield
			{
				name = "$STR_A3_MolosAirfield0";
				position[] = {26939.82,24743.81};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class Limnichori
			{
				name = "$STR_A3_Limnichori0";
				position[] = {25703.65,23561.58};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class CapStrigla
			{
				name = "$STR_A3_CapStrigla0";
				position[] = {28059.23,25626.37};
				type = "NameLocal";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Sideras
			{
				name = "$STR_A3_Sideras0";
				position[] = {23274.54,24198.3};
				type = "NameLocal";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class AgiosAndreas
			{
				name = "$STR_A3_AgiosAndreas0";
				position[] = {23682.88,24239.26};
				type = "Hill";
				radiusA = 400.0;
				radiusB = 100.0;
				angle = 0.0;
			};
			class NeriBay
			{
				name = "$STR_A3_NeriBay0";
				position[] = {3166.0,11234.17};
				type = "NameMarine";
				radiusA = 400.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class KavalaBay
			{
				name = "$STR_A3_KavalaBay0";
				position[] = {3004.58,13675.91};
				type = "NameMarine";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class NegadesBay
			{
				name = "$STR_A3_NegadesBay0";
				position[] = {3458.04,16859.63};
				type = "NameMarine";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class PanochoriBay
			{
				name = "$STR_A3_PanochoriBay0";
				position[] = {4005.29,9908.59};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class IremiBay
			{
				name = "$STR_A3_IremiBay0";
				position[] = {5117.63,9761.5};
				type = "NameMarine";
				radiusA = 400.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class EdessaBay
			{
				name = "$STR_A3_EdessaBay0";
				position[] = {6862.33,10614.14};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class ZarosBay
			{
				name = "$STR_A3_ZarosBay0";
				position[] = {9210.66,10250.45};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class NaftiaBay
			{
				name = "$STR_A3_NaftiaBay0";
				position[] = {12157.59,6376.24};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class MelaneraBay
			{
				name = "$STR_A3_MelaneraBay0";
				position[] = {11226.19,10574.7};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class KatalakiBay
			{
				name = "$STR_A3_KatalakiBay0";
				position[] = {12269.85,13659.34};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class PyrgosGulf
			{
				name = "$STR_A3_PyrgosGulf0";
				position[] = {15139.24,14229.94};
				type = "NameMarine";
				radiusA = 600.0;
				radiusB = 200.0;
				angle = 0.0;
			};
			class MaziBay
			{
				name = "$STR_A3_MaziBay0";
				position[] = {22181.44,6154.23};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class ChalkeiaBay
			{
				name = "$STR_A3_ChalkeiaBay0";
				position[] = {21859.61,12594.88};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class ThelosBay
			{
				name = "$STR_A3_ThelosBay0";
				position[] = {22979.69,14938.95};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class MolosBay
			{
				name = "$STR_A3_MolosBay0";
				position[] = {27826.85,24244.45};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class GalanaNeraBay
			{
				name = "$STR_A3_GalanaNeraBay0";
				position[] = {24924.08,24206.55};
				type = "NameMarine";
				radiusA = 690.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class PefkasBay
			{
				name = "$STR_A3_PefkasBay0";
				position[] = {21204.7,20464.64};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class KalitheaBay
			{
				name = "$STR_A3_KalitheaBay0";
				position[] = {18160.96,18676.63};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class TonosBay
			{
				name = "$STR_A3_TonosBay0";
				position[] = {11988.3,22985.67};
				type = "NameMarine";
				radiusA = 260.96;
				radiusB = 198.05;
				angle = 0.0;
			};
			class AmmolofiBay
			{
				name = "$STR_A3_AmmolofiBay0";
				position[] = {9525.44,22649.01};
				type = "NameMarine";
				radiusA = 500.0;
				radiusB = 150.0;
				angle = 0.0;
			};
			class Mine01
			{
				name = "$STR_A3_Mine010";
				position[] = {18435.12,14301.76};
				type = "NameLocal";
				radiusA = 200.0;
				radiusB = 100.0;
				angle = 0.0;
			};
		};
		safePositionAnchor[] = {15667,15791.3};
		safePositionRadius = 7000;
		loadingTexts[] = {"$STR_A3_CfgWorlds_Altis_loadingText1","$STR_A3_CfgWorlds_Altis_loadingText2","$STR_A3_CfgWorlds_Altis_loadingText3","$STR_A3_CfgWorlds_Altis_loadingText4","$STR_A3_CfgWorlds_Altis_loadingText5","$STR_A3_CfgWorlds_Altis_loadingText6","$STR_A3_CfgWorlds_Altis_loadingText7","$STR_A3_CfgWorlds_Altis_loadingText8","$STR_A3_CfgWorlds_Altis_loadingText9","$STR_A3_CfgWorlds_Altis_loadingText10","$STR_A3_CfgWorlds_Altis_loadingText11","$STR_A3_CfgWorlds_Altis_loadingText12","$STR_A3_CfgWorlds_Altis_loadingText13","$STR_A3_CfgWorlds_Altis_loadingText14","$STR_A3_CfgWorlds_Altis_loadingText15","$STR_A3_CfgWorlds_Altis_loadingText16","$STR_A3_CfgWorlds_Altis_loadingText17","$STR_A3_CfgWorlds_Altis_loadingText18","$STR_A3_CfgWorlds_Altis_loadingText19","$STR_A3_CfgWorlds_Altis_loadingText21","$STR_A3_CfgWorlds_Altis_loadingText20","$STR_A3_CfgWorlds_Altis_loadingText22","$STR_A3_CfgWorlds_Altis_loadingText23","$STR_A3_CfgWorlds_Altis_loadingText24","$STR_A3_CfgWorlds_Altis_loadingText25","$STR_A3_CfgWorlds_Altis_loadingText26","$STR_A3_CfgWorlds_Altis_loadingText27","$STR_A3_CfgWorlds_Altis_loadingText28","$STR_A3_CfgWorlds_Altis_loadingText29","$STR_A3_CfgWorlds_Altis_loadingText30"};
	};
};
class CfgWorldList
{
	class Altis{};
};
class CfgLensFlare
{
	flarePos[] = {0.0,0.0,0.37,0.47,0.5,0.54,0.62,0.72,0.75,0.91,1.0,1.084,1.13,1.29,1.62,1.68};
	flareSizeCam[] = {0.2,0.4,0.025,0.05,0.042,0.043,0.04,0.75,0.6,0.7,0.15,0.85,0.44,0.45,0.55,0.1};
	flareBright[] = {1.0,0.3,0.3,0.3,0.3,0.4,0.4,0.05,0.03,0.12,0.05,0.08,0.05,0.2,0.2,1.0};
	flareSizeEye[] = {0.04};
	flareSizeEyeSun[] = {0.04};
};
