'use strict';


const IMAGE_VIEW_ADMISSION = 'https://bit.ly/chatbotvinhnguyen-5-2';
const IMAGE_VIEW_TRANSCRIPT = 'https://bit.ly/chatbotvinhnguyen-6';
const IMAGE_VIEW_TRANSCRIPT_2 = 'https://bit.ly/chatbotvinhnguyen-7';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Product', [
      {
        "title": "Admission methods",
        "subtitle": "Candidates can choose one of the following admission methods with the following specific conditions.",
        "image_url": IMAGE_VIEW_ADMISSION,
        "payload": "VIEW_ADMISSION",
      },
      {
        "title": " High school transcript results",
        "subtitle": "Click See details for more information.",
        "image_url": IMAGE_VIEW_TRANSCRIPT,
        "payload": "VIEW_TRANSCRIPT",
      },
      {
        "title": "Results of the high school graduation exam",
        "subtitle": "Click See details for more information.",
        "image_url": IMAGE_VIEW_TRANSCRIPT_2,
        "payload": "VIEW_TRANSCRIPT_2",
      },
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
