import { adminEndpoint } from "../../constraints/adminEndpoints";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import adminAxios from "../../utils/axios/adminAxios.config";

class AdminHelper {

    async fetchCourses() {
        const response = await adminAxios.get(courseEndpoint.fetchCourseData);
        return response;
    }

    async fetchPayouts () {
        const response = await adminAxios.get(adminEndpoint.fetchAllOrders, {withCredentials :true});
        console.log(response.data, 'response .data')
        return  response.data.orderData.reverse();
    }
}

export const adminHelper = new AdminHelper()

