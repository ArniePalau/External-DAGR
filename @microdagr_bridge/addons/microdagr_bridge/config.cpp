class CfgPatches {
    class microdagr_bridge {
        name = "MicroDAGR Telemetry Bridge";
        units[] = {};
        weapons[] = {};
        requiredVersion = 1.0;
        requiredAddons[] = {"A3_Functions_F"};
        author = "Antigravity";
    };
};

class CfgFunctions {
    class microdagr_bridge {
        class Telemetry {
            class postInit {
                file = "\microdagr_bridge\init.sqf";
                postInit = 1;
            };
        };
    };
};
