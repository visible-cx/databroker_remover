function Done({ email }) {
  return (
    <div class="grid">
      <h1 class="text-4xl font-bold text-green-600 m-auto">Done!</h1>
      <p class="font-bold text-gray-700 m-auto mt-2">
        This was built by the Team at Visible. If you'd like to see more of what
        we do you can click More Info, or if you'd like to get updates as we release new tools you can join the
        community below.
      </p>
      <div class="my-4 max-w-fit justify-center flex rounded-md mx-auto gap-4">
        <a
          href={`https://www.visible.cx/join`}
          class="fit-content rounded-md p-2 m-auto bg-[#1bd4d4]"
        >
          More Info
        </a>
        <a
          href={`https://i.prefinery.com/projects/rjddzqda/users/instant?email=${email}&utm_source=removalTool&utm_campaign=removalTool`}
          class="fit-content rounded-md p-2 m-auto bg-[#1bd4d4]"
        >
          Join the community
        </a>
      </div>
      <p class="font-bold text-gray-700 m-auto mt-2">
        If you want to you can repeat this after 45 days, generally we do it
        every 90 days.
      </p>
    </div>
  )
}
export default Done
