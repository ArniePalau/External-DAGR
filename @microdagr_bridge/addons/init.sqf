if (!hasInterface) exitWith {};

diag_log "[Bridge] MicroDAGR Telemetry Bridge initializing...";

[] spawn {
    waitUntil {time > 0 && !isNull player};
    private _bridgeScriptVersion = "marker-chunks-v7";
    diag_log "[Bridge] Started loop for MicroDAGR variables";
    diag_log format ["[Bridge] Script version %1 active", _bridgeScriptVersion];
    private _markerUpdateTick = 0;
    private _markerUpdateInterval = 100;
    private _lastMarkerSignature = "";
    private _maxMarkersPerFrame = 220;

    private _sanitizeForJson = {
        params ["_value", ["_maxChars", 96]];
        private _arr = if (_value isEqualType "") then { toArray _value } else { toArray (str _value) };
        if (_maxChars > 0 && {(count _arr) > _maxChars}) then {
            _arr = _arr select [0, _maxChars];
        };
        _arr = _arr apply {
            if ((_x == 34) || (_x == 92)) then {95} else {_x}
        };
        toString _arr
    };

    private _cfgColorToRgba = {
        params ["_colorClass"];
        private _rgba = [1, 1, 1, 1];

        if (_colorClass isEqualType "" && {_colorClass != ""}) then {
            private _cfgColor = configFile >> "CfgMarkerColors" >> _colorClass >> "color";
            if (isArray _cfgColor) then {
                private _raw = getArray _cfgColor;
                if ((count _raw) >= 3) then {
                    _rgba = _raw apply {
                        if (_x isEqualType 0) then {
                            _x
                        } else {
                            1
                        }
                    };
                };
            };
        };

        [
            ((_rgba param [0, 1]) max 0) min 1,
            ((_rgba param [1, 1]) max 0) min 1,
            ((_rgba param [2, 1]) max 0) min 1,
            ((_rgba param [3, 1]) max 0) min 1
        ]
    };

    while {true} do {
        private _time = [dayTime, "HH:MM:SS"] call bis_fnc_timeToString;
        private _unit = vehicle player;
        
        // Telemetry extracted directly from Arma engine/player state
        private _heading = getDir player;
        private _speed = round (speed _unit);
        private _asl = round ((getPosASL player) select 2);
        private _worldName = worldName;
        private _worldSize = worldSize;
        private _pos = getPosWorld _unit;
        private _posX = _pos select 0;
        private _posY = _pos select 1;
        
        private _grid = mapGridPosition player;
        private _gridX = _grid select [0, 3];
        private _gridY = _grid select [3, 3];

        private _targetName = "NO TARGET";
        
        // Output as stringified JSON directly:
        private _json = format ["[MICRODAGR_TELEMETRY] {""time"": ""%1"", ""heading"": %2, ""speed"": %3, ""asl"": %4, ""gridX"": ""%5"", ""gridY"": ""%6"", ""targetName"": ""%7"", ""worldName"": ""%8"", ""worldSize"": %9, ""posX"": %10, ""posY"": %11}", 
            _time, _heading, _speed, _asl, _gridX, _gridY, _targetName, _worldName, _worldSize, _posX, _posY
        ];

        diag_log _json;

        // Emit an extra heading-only frame halfway to make direction update at 100 Hz.
        sleep 0.01;
        private _headingFast = getDir player;
        private _headingJson = format ["[MICRODAGR_TELEMETRY] {""heading"": %1}", _headingFast];
        diag_log _headingJson;

        _markerUpdateTick = _markerUpdateTick + 1;
        if (_markerUpdateTick >= _markerUpdateInterval) then {
            _markerUpdateTick = 0;
            private _markerEntries = [];
            private _allMarkers = allMapMarkers;
            private _totalMarkersRaw = count _allMarkers;
            private _truncatedByCount = false;

            {
                if ((count _markerEntries) >= _maxMarkersPerFrame) exitWith {
                    _truncatedByCount = true;
                };

                private _markerPos = getMarkerPos _x;
                private _mx = _markerPos select 0;
                private _my = _markerPos select 1;

                if !(_markerPos isEqualTo [0,0,0]) then {
                    private _markerName = [_x, 80] call _sanitizeForJson;
                    private _text = [markerText _x, 120] call _sanitizeForJson;
                    private _colorClass = markerColor _x;
                    private _colorName = [_colorClass, 48] call _sanitizeForJson;
                    private _colorRgba = [_colorClass] call _cfgColorToRgba;
                    private _colorR = _colorRgba param [0, 1];
                    private _colorG = _colorRgba param [1, 1];
                    private _colorB = _colorRgba param [2, 1];
                    private _colorA = _colorRgba param [3, 1];
                    private _shapeRaw = markerShape _x;
                    private _shape = [_shapeRaw, 24] call _sanitizeForJson;
                    private _typeRaw = markerType _x;
                    private _type = [_typeRaw, 64] call _sanitizeForJson;
                    private _brush = [markerBrush _x, 32] call _sanitizeForJson;
                    private _alpha = markerAlpha _x;
                    _alpha = (_alpha max 0) min 1;
                    private _iconPathRaw = "";
                    if (_typeRaw != "") then {
                        _iconPathRaw = getText (configFile >> "CfgMarkers" >> _typeRaw >> "icon");
                    };
                    private _iconPath = [_iconPathRaw, 96] call _sanitizeForJson;
                    private _dir = markerDir _x;
                    private _size = markerSize _x;
                    private _sizeX = _size param [0, 0];
                    private _sizeY = _size param [1, 0];
                    private _isPolylineShape = toUpper _shapeRaw isEqualTo "POLYLINE";
                    private _polylineNeedsOffset = false;

                    private _polylineRaw = markerPolyline _x;
                    private _pointEntries = [];
                    if ((count _polylineRaw) > 0) then {
                        private _maxPairs = 10;
                        if (_isPolylineShape) then {
                            private _sampleX = 0;
                            private _sampleY = 0;
                            private _hasSample = false;

                            if ((_polylineRaw select 0) isEqualType []) then {
                                {
                                    if ((_x isEqualType []) && {(count _x) >= 2}) exitWith {
                                        _sampleX = _x param [0, 0];
                                        _sampleY = _x param [1, 0];
                                        _hasSample = true;
                                    };
                                } forEach _polylineRaw;
                            } else {
                                if ((count _polylineRaw) >= 2) then {
                                    _sampleX = _polylineRaw select 0;
                                    _sampleY = _polylineRaw select 1;
                                    _hasSample = true;
                                };
                            };

                            if (_hasSample) then {
                                private _rawDist = (abs (_sampleX - _mx)) + (abs (_sampleY - _my));
                                private _offsetDist = (abs _sampleX) + (abs _sampleY);
                                _polylineNeedsOffset = _offsetDist < _rawDist;
                            };
                        };

                        if ((_polylineRaw select 0) isEqualType []) then {
                            private _stride = ceil ((count _polylineRaw) / _maxPairs);
                            if (_stride < 1) then { _stride = 1; };

                            private _idx = 0;
                            {
                                if ((_x isEqualType []) && {(count _x) >= 2}) then {
                                    if ((_idx % _stride) == 0) then {
                                        private _px = _x param [0, 0];
                                        private _py = _x param [1, 0];
                                        if (_polylineNeedsOffset) then {
                                            _px = _mx + _px;
                                            _py = _my + _py;
                                        };
                                        _pointEntries pushBack format ["[%1,%2]", _px, _py];
                                    };
                                    _idx = _idx + 1;
                                };
                            } forEach _polylineRaw;
                        } else {
                            private _pairCount = floor ((count _polylineRaw) / 2);
                            private _stride = ceil (_pairCount / _maxPairs);
                            if (_stride < 1) then { _stride = 1; };

                            for "_i" from 0 to ((count _polylineRaw) - 2) step (2 * _stride) do {
                                private _px = _polylineRaw select _i;
                                private _py = _polylineRaw select (_i + 1);
                                if (_polylineNeedsOffset) then {
                                    _px = _mx + _px;
                                    _py = _my + _py;
                                };
                                _pointEntries pushBack format ["[%1,%2]", _px, _py];
                            };
                        };
                    };

                    private _entry = format [
                        "{""id"":""%1"",""x"":%2,""y"":%3,""t"":""%4"",""c"":""%5"",""s"":""%6"",""k"":""%7"",""d"":%8,""sx"":%9,""sy"":%10,""b"":""%11"",""a"":%12,""cr"":%13,""cg"":%14,""cb"":%15,""ca"":%16,""i"":""%17"",""p"": [%18]}",
                        _markerName,
                        _mx,
                        _my,
                        _text,
                        _colorName,
                        _shape,
                        _type,
                        _dir,
                        _sizeX,
                        _sizeY,
                        _brush,
                        _alpha,
                        _colorR,
                        _colorG,
                        _colorB,
                        _colorA,
                        _iconPath,
                        _pointEntries joinString ","
                    ];
                    _markerEntries pushBack _entry;
                };
            } forEach _allMarkers;

            private _markerSignature = _markerEntries joinString "|";
            if !(_markerSignature isEqualTo _lastMarkerSignature) then {
                _lastMarkerSignature = _markerSignature;
                diag_log "[MICRODAGR_TELEMETRY] {""mapMarkersReset"":true}";

                private _chunkSize = 1;
                private _total = count _markerEntries;
                private _metaPayload = format ["[MICRODAGR_TELEMETRY] {""mapMarkersMeta"":{""v"":""%1"",""count"":%2,""rawCount"":%3,""truncated"":%4}}", _bridgeScriptVersion, _total, _totalMarkersRaw, _truncatedByCount];
                diag_log _metaPayload;
                if (_total > 0) then {
                    for "_start" from 0 to (_total - 1) step _chunkSize do {
                        private _end = (_start + _chunkSize - 1) min (_total - 1);
                        private _chunk = _markerEntries select [_start, (_end - _start + 1)];
                        private _chunkPayload = format ["[MICRODAGR_TELEMETRY] {""mapMarkersChunk"":[%1]}", _chunk joinString ","];
                        diag_log _chunkPayload;
                    };
                };
            };
        };

        // Full telemetry stays at 50 Hz total loop cycle (0.02s)
        sleep 0.01;
    };
};
