local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('qb-idcard:client:open', function(info,nui)
    SetNuiFocus(true,false)
    SendNUIMessage({
        nui = nui,
        information = info
    })
end)

RegisterNUICallback("escape", function()
    SetNuiFocus(false)
end)
