var elaborantApp = angular.module('elaborant', ["elaborantRouter",
												"angularMoment", 
												"btorfs.multiselect", 
												"ui.bootstrap",
												
												"elaborantMainPageCtrl",
												"elaborantNavCtrl",
												"elaborantCurrentUserCtrl",
												"elaborantLaboratoryCtrl",
												"elaborantLaboratoryManagerCtrl",
												"elaborantLaboratoryService",
												"elaborantComputerCtrl",
												"elaborantComputerManagerCtrl",
												"elaborantComputerService",
												"elaborantLoginCtrl",
												"elaborantLoginService",
												"elaborantUserCtrl",
												"elaborantUserManagerCtrl",
												"elaborantPasswordManagerCtrl",
												"elaborantOwnPasswordManagerCtrl",
												"elaborantProblemCtrl",
												"elaborantProblemManagerCtrl",
												"elaborantTaskCtrl",
												"elaborantTaskManagerCtrl",
												"elaborantAdminPanelCtrl",
												"elaborantPaginationCtrl",
												"elaborantLoginService",
												"elaborantTaskService",
												"elaborantUserService",
												"elaborantStateService",
												"elaborantModalService",
												"elaborantNotificationService"
												]);
module.exports = {
  elaborantApp: elaborantApp
};