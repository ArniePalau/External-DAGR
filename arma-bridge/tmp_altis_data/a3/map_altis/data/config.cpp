////////////////////////////////////////////////////////////////////
//DeRap: config.bin
//Produced from mikero's Dos Tools Dll version 10.13
//https://mikero.bytex.digital/Downloads
//'now' is Thu Apr 02 18:04:15 2026 : 'file' last modified on Thu Oct 25 15:40:45 2018
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
	class A3_Map_Altis_Data
	{
		author = "$STR_A3_Bohemia_Interactive";
		name = "Arma 3 - Altis Map Skybox";
		url = "https://www.arma3.com";
		requiredAddons[] = {"A3_Map_Altis"};
		requiredVersion = 0.1;
		units[] = {};
		weapons[] = {};
	};
};
