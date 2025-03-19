// import MapView from "@arcgis/core/views/MapView.js";
import Portal from "@arcgis/core/portal/Portal.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import esriRequest from "@arcgis/core/request.js";

const oAuthOptions = {
  // https://prof-services.maps.arcgis.com/home/item.html?id=bd2f2c00808747c2a5bee10040f0cc31#overview
  appId: "5zExhoFVwOyHuQaL",
  portalUrl: "https://prof-services.maps.arcgis.com", // INCLUDE IF USING ARCGIS ENTERPRISE!
  popup: false,
};

const createFeatureService = async ({ portal, item }) => {
  console.log("portal", portal);
  const url = `${portal.restUrl}/content/users/${portal.user.username}/createService`;

  const body = {
    createParameters: JSON.stringify(item),
    outputType: "featureService",
    f: "json",
  };

  // the credential/token is automatically added when using esriRequest:
  return await esriRequest(url, {
    method: "post",
    responseType: "json",
    query: body,
  });
};

const createFS = async (portal, featureServiceName) => {
  results.innerHTML = "Creating service ...";
  // we SHOULD check to see if the service name is available using
  // https://org.arcgis.com/sharing/rest/portals/_ID_/isServiceNameAvailable?name=test_Layer_1&type=Feature%20Service&f=json&token=
  // but we're skipping that for now.
  const createFeatureServiceResult = await createFeatureService({
    portal,
    item: {
      name: featureServiceName,
      capabilities: "Create,Delete,Query,Update,Editing",
    },
  });

  console.log("createFeatureServiceResult", createFeatureServiceResult);

  // Now call addToServiceDefinition to add layers to the Feature Service
  const adminUrl = `${createFeatureServiceResult.data.serviceurl.replace(
    `/rest/services`,
    `/rest/admin/services`
  )}/addToDefinition`;

  const body = {
    f: "json",
    addToDefinition: JSON.stringify({
      layers: [
        {
          id: 0,
          name: featureServiceName,
          geometryType: "esriGeometryPoint",
          type: "Feature Layer",
          // defaultVisibility: true,
          // editingInfo: { lastEditDate: null },
          // isDataVersioned: false,
          // supportsAppend: true,
          // supportsCalculate: true,
          // supportsTruncate: true,
          // supportsAttachmentsByUploadId: true,
          // supportsAttachmentsResizing: true,
          // supportsRollbackOnFailureParameter: true,
          // supportsStatistics: true,
          // supportsAdvancedQueries: true,
          // supportsValidateSql: true,
          // supportsCoordinatesQuantization: true,
          // supportsApplyEditsWithGlobalIds: false,
          // supportsMultiScaleGeometry: true,
          // hasGeometryProperties: true,
          // geometryProperties: {
          //   shapeLengthFieldName: "Shape__Length",
          //   units: "esriMeters",
          // },
          // advancedQueryCapabilities: {
          //   supportsPagination: true,
          //   supportsPaginationOnAggregatedQueries: true,
          //   supportsQueryRelatedPagination: true,
          //   supportsQueryWithDistance: true,
          //   supportsReturningQueryExtent: true,
          //   supportsStatistics: true,
          //   supportsOrderBy: true,
          //   supportsDistinct: true,
          //   supportsQueryWithResultType: true,
          //   supportsSqlExpression: true,
          //   supportsAdvancedQueryRelated: true,
          //   supportsCountDistinct: true,
          //   supportsLod: true,
          //   supportsReturningGeometryCentroid: false,
          //   supportsReturningGeometryProperties: true,
          //   supportsQueryWithDatumTransformation: true,
          //   supportsHavingClause: true,
          //   supportsOutFieldSQLExpression: true,
          // },
          useStandardizedQueries: true,
          minScale: 0,
          maxScale: 0,
          extent: {
            xmin: -17811118.526923772,
            ymin: -15538711.096309224,
            xmax: 17811118.526923772,
            ymax: 15538711.096309224,
            spatialReference: { wkid: 102100, latestWkid: 3857 },
          },
          drawingInfo: {
            renderer: {
              type: "simple",
              symbol: {
                type: "esriPMS",
                url: "RedSphere.png",
                imageData:
                  "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",
                contentType: "image/png",
                width: 15,
                height: 15,
              },
            },
          },
          allowGeometryUpdates: true,
          hasAttachments: true,
          htmlPopupType: "esriServerHTMLPopupTypeNone",
          hasMetadata: true,
          hasM: false,
          hasZ: false,
          objectIdField: "OBJECTID",
          uniqueIdField: { name: "OBJECTID", isSystemMaintained: true },
          fields: [
            {
              name: "OBJECTID",
              type: "esriFieldTypeOID",
              alias: "OBJECTID",
              sqlType: "sqlTypeOther",
              nullable: false,
              editable: false,
              domain: null,
              defaultValue: null,
            },
          ],
          capabilities: "Query,Editing,Create,Update,Delete,Sync",
          maxRecordCount: 2000,
          supportedQueryFormats: "JSON, geoJSON, PBF",
          indexes: [],
          types: [],
          templates: [
            {
              name: "New Feature",
              description: "",
              drawingTool: "esriFeatureEditToolPoint",
              prototype: { attributes: {} },
            },
          ],
          globalIdField: "",
          hasStaticData: false,
        },
      ],
    }),
  };

  const addToServiceDefinitionResults = await esriRequest(adminUrl, {
    method: "post",
    responseType: "json",
    query: body,
  });

  console.log("addToServiceDefinitionResults", addToServiceDefinitionResults);

  if (addToServiceDefinitionResults.data.success === true) {
    const credential = await esriId.getCredential(
      createFeatureServiceResult.data.serviceurl
    );
    results.innerHTML = `Created service:  <br />
    <a target="_blank" href="https://arcgis.com/home/item.html?id=${createFeatureServiceResult.data.itemId}">Item</a><br />
    <a target="_blank" href="${createFeatureServiceResult.data.serviceurl}?token=${credential.token}">Service URL</a><br />
    `;
  }
};

const checkSignIn = async () => {
  try {
    const credential = await esriId.checkSignInStatus(
      oAuthOptions.portalUrl + "/sharing"
    );
    console.log("credential", credential);
    const portal = new Portal({
      authMode: "immediate",
    });

    await portal.load();
    return portal;
  } catch (E) {
    console.log("NOT SIGNED IN - SHOW LOGIN BUTTON");
    return false;
  }
};

const signOut = () => {
  esriId.destroyCredentials();
  window.location.reload();
};
const signIn = async () => {
  // If the user is not signed in, generate a new credential.
  await esriId.getCredential(oAuthOptions.portalUrl + "/sharing", {
    oAuthPopupConfirmation: false,
  });

  await updateUI();
};

const updateUI = async () => {
  const portal = await checkSignIn();

  if (portal) {
    loginButtonWrapper.classList.add("hidden");
    createFeatureServiceWrapper.classList.remove("hidden");
  }
};

const main = async () => {
  const info = new OAuthInfo(oAuthOptions);
  esriId.registerOAuthInfos([info]);

  await updateUI();

  // // When the login button is clicked, start the login process:
  loginButton.addEventListener("click", () => {
    signIn();
  });

  logoutButton.addEventListener("click", () => {
    signOut();
  });

  // When the "create service" button is clicked, create the feature service
  createFeatureServiceButton.addEventListener("click", async () => {
    const portal = await checkSignIn();
    if (portal && featureServiceNameInput.value !== "") {
      createFS(portal, featureServiceNameInput.value);
    } else {
      console.error("Invalid inputs.");
    }
  });
};

main();
