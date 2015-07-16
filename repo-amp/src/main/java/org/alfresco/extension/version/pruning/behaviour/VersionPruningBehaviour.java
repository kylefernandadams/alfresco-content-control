package org.alfresco.extension.version.pruning.behaviour;

import org.alfresco.extension.version.pruning.model.VersionPruningContentModel;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.policy.Behaviour;
import org.alfresco.repo.policy.JavaBehaviour;
import org.alfresco.repo.policy.PolicyComponent;
import org.alfresco.repo.version.VersionServicePolicies;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.dictionary.InvalidAspectException;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionHistory;
import org.alfresco.service.cmr.version.VersionService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Collection;

/**
 * Created by kadams on 4/14/14.
 */
public class VersionPruningBehaviour implements VersionServicePolicies.AfterCreateVersionPolicy {
    private static final Log logger = LogFactory.getLog(VersionPruningBehaviour.class);

    private ServiceRegistry serviceRegistry;
    private PolicyComponent policyComponent;
    private NodeService nodeService;
    private VersionService versionService;

    private int maxVersionCount;
    private boolean keepRootVersion;

    public void init(){
        this.policyComponent.bindClassBehaviour(
                VersionServicePolicies.AfterCreateVersionPolicy.QNAME,
                ContentModel.TYPE_CONTENT,
                new JavaBehaviour(this, "afterCreateVersion", Behaviour.NotificationFrequency.TRANSACTION_COMMIT));

        this.nodeService = this.serviceRegistry.getNodeService();
        this.versionService = this.serviceRegistry.getVersionService();

    }

    @Override
    public void afterCreateVersion(NodeRef versionedNodeRef, Version version) {

        try {
            if(this.nodeService.hasAspect(versionedNodeRef, VersionPruningContentModel.ASPECT_VERSION_PRUNABLE)) {
                VersionHistory versionHistory = this.versionService.getVersionHistory(versionedNodeRef);
                if(versionHistory != null){
                    this.keepRootVersion = (boolean) this.nodeService.getProperty(versionedNodeRef, VersionPruningContentModel.PROP_KEEP_ROOT_VERSION);
                    this.maxVersionCount = (int) this.nodeService.getProperty(versionedNodeRef, VersionPruningContentModel.PROP_MAX_VERSION_COUNT);

                    if(maxVersionCount > 0){
                        while(versionHistory.getAllVersions().size() > maxVersionCount){
                            Version versionToBeDeleted = null;
                            if(keepRootVersion) {
                                 versionToBeDeleted = versionHistory.getSuccessors(versionHistory.getRootVersion()).iterator().next();
                            }
                            else{
                                versionToBeDeleted = versionHistory.getRootVersion();
                            }

                            if(logger.isDebugEnabled()){
                                logger.debug("Max Version Count: " + maxVersionCount);
                                logger.debug("Keep Root Version? " + keepRootVersion);
                                logger.debug("Current version history collection size: " + versionHistory.getAllVersions().size());
                                logger.debug("Preparing to remove version: " + versionToBeDeleted.getVersionLabel() + " type: " + versionToBeDeleted.getVersionType());
                            }
                            this.versionService.deleteVersion(versionedNodeRef, versionToBeDeleted);
                            versionHistory = this.versionService.getVersionHistory(versionedNodeRef);
                        }
                    }
                }
                else{
                    if(logger.isDebugEnabled()){
                        logger.debug("No version history found!");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setServiceRegistry(ServiceRegistry serviceRegistry) {
        this.serviceRegistry = serviceRegistry;
    }
    public void setPolicyComponent(PolicyComponent policyComponent) {
        this.policyComponent = policyComponent;
    }
}