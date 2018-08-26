var cycles = [{
		name: "Carnot Cycle",
		paths: [
			(_state) => { //hot isotherm: Tc P1 to Tc Ph
				var sysvar = cycles[0].vars;
				_state.t = sysvar.Tc;
				var vmin = _state.n * R * sysvar.Tc / sysvar.Pl;
				var vmax = _state.n * R * sysvar.Tc / sysvar.Ph;
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = _state.n * R * _state.t / _state.v;
			},
			(_state) => { //low pressure adiabat: Tc Ph to Th P'h
				var sysvar = cycles[0].vars;
				var vmin = _state.n * R * sysvar.Tc / sysvar.Ph;
				var vmax = Math.pow(_state.n * R * sysvar.Th / (sysvar.Ph * Math.pow(vmin, _state.gamma)), 1 / (1 - _state.gamma));
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = sysvar.Ph * Math.pow(vmin, _state.gamma) / Math.pow(_state.v, _state.gamma);
				auto('t', _state);
			},
			(_state) => { //cold isotherm: Th P'h to Th P'l
				var sysvar = cycles[0].vars;
				_state.t = sysvar.Th;
				var phl = (sysvar.Ph * Math.pow(_state.n * R * sysvar.Tc / sysvar.Ph, _state.gamma) / Math.pow(Math.pow(_state.n * R * sysvar.Th / (sysvar.Ph * Math.pow(_state.n * R * sysvar.Tc / sysvar.Ph, _state.gamma)), 1 / (1 - _state.gamma)), _state.gamma));
				var vmin = _state.n * R * sysvar.Th / phl; //because going backwards now
				var vmax = Math.pow(_state.n * R * sysvar.Th / (sysvar.Pl * Math.pow(_state.n * R * sysvar.Tc / sysvar.Pl, _state.gamma)), 1 / (1 - _state.gamma));
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = _state.n * R * _state.t / _state.v;
			},
			(_state) => { //high pressure adiabat: Th P'l to Tc Pl
				var sysvar = cycles[0].vars;
				var vmax = _state.n * R * sysvar.Tc / sysvar.Pl;
				var vmin = Math.pow(_state.n * R * sysvar.Th / (sysvar.Pl * Math.pow(vmax, _state.gamma)), 1 / (1 - _state.gamma));
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = sysvar.Pl * Math.pow(vmax, _state.gamma) / Math.pow(_state.v, _state.gamma);
				auto('t', _state);
			}
		],
		//adiabat isotherm adiabat isotherm
		//minimally characterising facts: T1, T2, P1t, P2t
		vars: {
			Th: 100,
			Tc: 20,
			Ph: 20,
			Pl: 10
		}
	}, {
		name: "Stirling Cycle",
		paths: [
			(_state) => { //hot isotherm: Th Vl to Th Vh
				var sysvar = cycles[1].vars;
				_state.t = sysvar.Th;
				var vmin = sysvar.Vl;
				var vmax = sysvar.Vh;
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = _state.n * R * _state.t / _state.v;
			},
			(_state) => { //forward isochor: Th Vh to Tc Vh
				var sysvar = cycles[1].vars;
				_state.v = sysvar.Vh;
				var pmin = _state.n * R * sysvar.Th / _state.v;
				var pmax = _state.n * R * sysvar.Tc / _state.v;
				_state.p = pmin + (pmax - pmin) * _state.path_percent / 100;
				auto('t', _state);
			},
			(_state) => { //cold isotherm: Tc Vh to Tc Vl
				var sysvar = cycles[1].vars;
				_state.t = sysvar.Tc;
				var vmin = sysvar.Vh;
				var vmax = sysvar.Vl;
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = _state.n * R * _state.t / _state.v;
			},
			(_state) => { //backward isochor: Tc Vl to Th Vl
				var sysvar = cycles[1].vars;
				_state.v = sysvar.Vl;
				var pmin = _state.n * R * sysvar.Tc / _state.v;
				var pmax = _state.n * R * sysvar.Th / _state.v;
				_state.p = pmin + (pmax - pmin) * _state.path_percent / 100;
				auto('t', _state);
			}
		],
		vars: {
			Th: 100,
			Tc: 20,
			Vl: 10,
			Vh: 20
		}
	}, {
		name: "Isobar/Isochor Cycle",
		paths: [
			(_state) => { //isobar 1
				var sysvar = cycles[2].vars;
				var vmin = sysvar.Vl;
				var vmax = sysvar.Vh;
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = sysvar.Pl;
				auto('t',_state);
			},
			(_state) => { //isochor 1
				var sysvar = cycles[2].vars;
				var pmin = sysvar.Pl;
				var pmax = sysvar.Ph;
				_state.v = sysvar.Vh;
				_state.p = pmin + (pmax - pmin) * _state.path_percent / 100;
				auto('t',_state);
			},(_state) => { //isobar 1
				var sysvar = cycles[2].vars;
				var vmin = sysvar.Vh;
				var vmax = sysvar.Vl;
				_state.v = vmin + (vmax - vmin) * _state.path_percent / 100;
				_state.p = sysvar.Ph;
				auto('t',_state);
			},
			(_state) => { //isochor 1
				var sysvar = cycles[2].vars;
				var pmin = sysvar.Ph;
				var pmax = sysvar.Pl;
				_state.v = sysvar.Vl;
				_state.p = pmin + (pmax - pmin) * _state.path_percent / 100;
				auto('t',_state);
			}
		],
		vars: {
			Pl: 100,
			Ph: 20,
			Vl: 10,
			Vh: 20
		}
	}
];
