/* Class SimpleSelector 
    Provides the time of flight selection graphical user interface. 
    Inherits OrbitingBodySelector
*/
gui.SimpleSelector = function (orbitingBody) {
    gui.OrbitingBodySelector.call(this, orbitingBody);
    var self = this;

    this._configuration = {
        problemType: null
    };

    this._numOrbits = 5;

    this._maxTimeOfFlight = this._orbitingBody.getMaxTimeOfFlight() * utility.SEC_TO_DAY;
    this._maxLaunchDelay = this._orbitingBody.getMaxLaunchDelay() * utility.SEC_TO_DAY;
    this._epoch = 0;
    this._vehicle = null;

    this._backgroundName = 'simpleselector';
    this._backgroundHeightFactorLR = 0.15;
    this._backgroundHeightFactorUD = 0.15;
    this._backgroundWidthFactorLR = 3.00;
    this._backgroundWidthFactorUD = 2.745;
    this._containerHeightFactor = 0.76;
    this._containerWidthFactor = 0.92;
    this._containerMarginFactorL = 0.08;
    this._containerMarginFactorT = 0.24;

    var backgroundHeight = Math.round(window.innerHeight * this._backgroundHeightFactorUD);
    var backgroundWidth = Math.round(backgroundHeight * this._backgroundWidthFactorUD);

    this._backgroundElement = document.createElement('div');
    this._backgroundElement.className = 'simple-selector unselectable';
    this._backgroundElement.style.width = utility.toPixelString(backgroundWidth);
    this._backgroundElement.style.height = utility.toPixelString(backgroundHeight);
    this._backgroundElement.style.backgroundImage = 'url(res/svg/' + this._backgroundName + 'viewup.svg)';
    this._backgroundElement.style.display = 'none';
    this._backgroundElement.oncontextmenu = function () {
        return false;
    };

    this._containerElement = document.createElement('div');
    this._containerElement.className = 'container text-fit';
    this._containerElement.style.width = '100%';
    this._containerElement.style.height = utility.toPixelString(backgroundHeight * this._containerHeightFactor);

    var contextWrapper = document.createElement('div');
    contextWrapper.className = 'context-wrapper';

    this._infoWrapper = document.createElement('div');
    this._infoWrapper.className = 'info-wrapper';

    var titleElement = document.createElement('div');
    titleElement.className = 'title';
    titleElement.textContent = this._orbitingBody.getName();
    this._infoWrapper.appendChild(titleElement);

    contextWrapper.appendChild(this._infoWrapper);

    this._toolBoxWrapper = document.createElement('div');
    this._toolBoxWrapper.className = 'content-wrapper';

    var imageCol = document.createElement('div');
    imageCol.className = 'col1';
    this._imageElement = document.createElement('img');
    this._imageElement.className = 'image center-vertically center-horizontally';
    imageCol.appendChild(this._imageElement);

    var toolBoxCol = document.createElement('div');
    toolBoxCol.className = 'col2';

    this._launchEpochRow = document.createElement('div');
    this._launchEpochRow.className = 'row1';

    var col = document.createElement('div');
    col.className = 'col1';
    var img = document.createElement('img');
    img.src = 'res/svg/calendaricon.svg';
    img.className = 'icon center-horizontally center-vertically';
    col.appendChild(img);
    this._launchEpochRow.appendChild(col);

    col = document.createElement('div');
    col.className = 'col2';
    var wrapper = document.createElement('div');
    wrapper.className = 'rangeslider-wrapper center-vertically center-horizontally';
    wrapper.style.height = '60%';
    wrapper.style.width = '90%';

    this._launchEpochRangeSlider = new gui.RangeSlider(wrapper);
    col.appendChild(wrapper);
    this._launchEpochRow.appendChild(col);
    toolBoxCol.appendChild(this._launchEpochRow);

    this._velocityRow = document.createElement('div');
    this._velocityRow.className = 'row2';

    var col = document.createElement('div');
    col.className = 'col1';
    var img = document.createElement('img');
    img.src = 'res/svg/deltavicon.svg';
    img.className = 'icon center-horizontally center-vertically';
    col.appendChild(img);
    this._velocityRow.appendChild(col);

    col = document.createElement('div');
    col.className = 'col2';
    var wrapper = document.createElement('div');
    wrapper.className = 'rangeslider-wrapper center-vertically center-horizontally';
    wrapper.style.height = '60%';
    wrapper.style.width = '90%';

    this._velocityRangeSlider = new gui.RangeSlider(wrapper);
    col.appendChild(wrapper);
    this._velocityRow.appendChild(col);
    toolBoxCol.appendChild(this._velocityRow);

    this._radiusRow = document.createElement('div');
    this._radiusRow.className = 'row1';

    col = document.createElement('div');
    col.className = 'col1';
    img = document.createElement('img');
    img.src = 'res/svg/radiusicon.svg';
    img.className = 'icon center-horizontally center-vertically';
    col.appendChild(img);
    this._radiusRow.appendChild(col);

    col = document.createElement('div');
    col.className = 'col2';
    wrapper = document.createElement('div');
    wrapper.className = 'rangeslider-wrapper center-vertically center-horizontally';
    wrapper.style.height = '60%';
    wrapper.style.width = '90%';

    this._radiusRangeSlider = new gui.RangeSlider(wrapper);
    col.appendChild(wrapper);
    this._radiusRow.appendChild(col);
    toolBoxCol.appendChild(this._radiusRow);

    this._angleRow = document.createElement('div');
    this._angleRow.className = 'row2';

    col = document.createElement('div');
    col.className = 'col1';
    img = document.createElement('img');
    img.src = 'res/svg/angleicon.svg';
    img.className = 'icon center-horizontally center-vertically';
    col.appendChild(img);
    this._angleRow.appendChild(col);

    col = document.createElement('div');
    col.className = 'col2';
    wrapper = document.createElement('div');
    wrapper.className = 'rangeslider-wrapper center-vertically center-horizontally';
    wrapper.style.height = '60%';
    wrapper.style.width = '90%';

    this._betaRangeSlider = new gui.RangeSlider(wrapper);
    col.appendChild(wrapper);
    this._angleRow.appendChild(col);
    toolBoxCol.appendChild(this._angleRow);

    var row = document.createElement('div');
    row.className = 'row3';

    col = document.createElement('div');
    col.className = 'col1';
    img = document.createElement('img');
    img.src = 'res/svg/clockicon.svg';
    img.className = 'icon center-horizontally center-vertically';
    col.appendChild(img);
    row.appendChild(col);

    col = document.createElement('div');
    col.className = 'col2';
    wrapper = document.createElement('div');
    wrapper.className = 'rangeslider-wrapper center-vertically center-horizontally';
    wrapper.style.height = '60%';
    wrapper.style.width = '90%';

    var markerPositions = [];
    var orbitalPeriod = this._orbitingBody.getOrbitalPeriod() * utility.SEC_TO_DAY;
    for (var i = 1; i <= this._numOrbits; i++) {
        markerPositions.push(orbitalPeriod * i);
    }

    this._timeOfFlightRangeSlider = new gui.RangeSlider(wrapper, {
        rangeMarkerPositions: markerPositions
    });
    col.appendChild(wrapper);
    row.appendChild(col);
    toolBoxCol.appendChild(row);

    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'col3';

    var centerVertically = document.createElement('div');
    centerVertically.className = 'center-vertically center-horizontally';
    centerVertically.style.width = '90%';
    centerVertically.style.height = '70%';

    this._cancelElement = document.createElement('img');
    this._cancelElement.className = 'button';
    this._cancelElement.style.bottom = 0;
    this._cancelElement.src = 'res/svg/cancel.svg';
    this._cancelElement.onclick = function () {
        self._resetSelection();
        self._orbitingBody.onConfigurationDone(false);
    };
    centerVertically.appendChild(this._cancelElement);

    this._confirmElement = document.createElement('img');
    this._confirmElement.className = 'button';
    this._confirmElement.src = 'res/svg/confirm.svg';
    this._confirmElement.style.top = 0;
    this._confirmElement.disabled = false;
    this._confirmElement.onclick = function () {
        self._confirmAndClose();
    };
    centerVertically.appendChild(this._confirmElement);
    buttonContainer.appendChild(centerVertically);

    this._toolBoxWrapper.appendChild(imageCol);
    this._toolBoxWrapper.appendChild(toolBoxCol);
    this._toolBoxWrapper.appendChild(buttonContainer);
    contextWrapper.appendChild(this._toolBoxWrapper);
    this._containerElement.appendChild(contextWrapper);
    this._backgroundElement.appendChild(this._containerElement);
    document.body.appendChild(this._backgroundElement);

    this._hideConfiguration();
};
gui.SimpleSelector.prototype = Object.create(gui.OrbitingBodySelector.prototype);
gui.SimpleSelector.prototype.constructor = gui.SimpleSelector;

gui.SimpleSelector.prototype._showFlybyConfiguration = function () {
    this._toolBoxWrapper.style.display = 'block';
    this._radiusRow.style.display = 'block';
    this._angleRow.style.display = 'block';
    this._radiusRangeSlider.show();
    this._betaRangeSlider.show();
    this._timeOfFlightRangeSlider.show();
    this._resetSelection();
};

gui.SimpleSelector.prototype._showLaunchConfiguration = function () {
    this._toolBoxWrapper.style.display = 'block';
    this._launchEpochRow.style.display =  'block';
    this._velocityRow.style.display =  'block';
    this._launchEpochRangeSlider.show();
    this._timeOfFlightRangeSlider.show();
    this._velocityRangeSlider.show();
    this._resetSelection();
};

gui.SimpleSelector.prototype._hideConfiguration = function () {
    this._launchEpochRangeSlider.hide();
    this._radiusRangeSlider.hide();
    this._betaRangeSlider.hide();
    this._timeOfFlightRangeSlider.hide();
    this._velocityRangeSlider.hide();
    this._toolBoxWrapper.style.display = 'none';
    this._launchEpochRow.style.display = 'none';
    this._radiusRow.style.display = 'none';
    this._angleRow.style.display = 'none';
    this._velocityRow.style.display = 'none';
};

gui.SimpleSelector.prototype._updateSliders = function () {
    if (this._vehicle.isLanded()) {
        this._launchEpochRangeSlider.range(this._configuration.launchEpochBounds);
        this._velocityRangeSlider.range(this._configuration.velocityBounds);
    } else {
        this._radiusRangeSlider.range(this._configuration.radiusBounds);
        this._betaRangeSlider.range(this._configuration.betaBounds);
    }
    this._timeOfFlightRangeSlider.range(this._configuration.timeOfFlightBounds);
};

gui.SimpleSelector.prototype._resetSelection = function () {
    if (this._vehicle.isLanded()) {
        delete this._configuration.radiusBounds;
        delete this._configuration.betaBounds;
        this._configuration.problemType = astrodynamics.ProblemTypes.MGA1DSM_LAUNCH;
        this._configuration.launchEpochBounds = [this._epoch, this._epoch + this._maxLaunchDelay];
        this._configuration.velocityBounds = [0, this._vehicle.getRemainingDeltaV()];
    } else {
        delete this._configuration.launchEpochBounds;
        delete this._configuration.velocityBounds;
        this._configuration.problemType = astrodynamics.ProblemTypes.MGA1DSM_FLYBY;
        this._configuration.radiusBounds = [this._orbitingBody.getMinRadius() / this._orbitingBody.getRadius(), this._orbitingBody.getMaxRadius() / this._orbitingBody.getRadius()];
        this._configuration.betaBounds = [-2 * Math.PI, 2 * Math.PI];
    }
    this._configuration.timeOfFlightBounds = [1e-2, this._maxTimeOfFlight];
    this._updateSliders();
};

gui.SimpleSelector.prototype._onMove = function () {
    this._timeOfFlightRangeSlider.onMove();
    this._launchEpochRangeSlider.onMove();
    this._radiusRangeSlider.onMove();
};

gui.SimpleSelector.prototype._onResize = function () {
    this._timeOfFlightRangeSlider.onResize();
    this._launchEpochRangeSlider.onResize();
    this._radiusRangeSlider.onResize();
};

gui.SimpleSelector.prototype._confirmAndClose = function () {
    if (this._vehicle.isLanded()) {
        this._configuration.launchEpochBounds = [this._launchEpochRangeSlider.min(), this._launchEpochRangeSlider.max()];
        this._configuration.velocityBounds = [this._velocityRangeSlider.min(), this._velocityRangeSlider.max()];
    } else {
        this._configuration.radiusBounds = [this._radiusRangeSlider.min(), this._radiusRangeSlider.max()];
        this._configuration.betaBounds = [this._betaRangeSlider.min(), this._betaRangeSlider.max()];
    }
    this._configuration.timeOfFlightBounds = [this._timeOfFlightRangeSlider.min(), this._timeOfFlightRangeSlider.max()];
    this._orbitingBody.onConfigurationDone(true, this._configuration);
    this.hide();
};

gui.SimpleSelector.prototype.onActivated = function (epoch, vehicle) {
    this._epoch = epoch;
    this._vehicle = vehicle.clone();
    this._imageElement.src = this._vehicle.getStageImageURL();
    this._isActivated = true;
};

gui.SimpleSelector.prototype.onDeactivated = function () {
    this._epoch = 0;
    this._vehicle = null;
    this._imageElement.src = '';
    this._isActivated = false;
};

gui.SimpleSelector.prototype.show = function (editable) {
    this._isEditable = editable;
    this._backgroundElement.style.display = 'block';
    this._toolBoxWrapper.style.display = 'none';
    if (this._isEditable) {
        this._infoWrapper.style.display = 'none';
        if (this._vehicle.isLanded()) {
            this._showLaunchConfiguration();
        } else {
            this._showFlybyConfiguration();
        }
    } else {
        this._infoWrapper.style.display = 'flex';
    }
    this._isVisible = true;
    utility.fitText();
};

gui.SimpleSelector.prototype.hide = function () {
    this._orbitingBody.onConfigurationWindowOut();
    this._backgroundElement.style.display = 'none';
    this._hideConfiguration();
    this._isVisible = false;
    this._isEditable = false;
};